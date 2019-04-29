# !/usr/bin/env python
from http import HTTPStatus
from typing import Union, NoReturn

import flask
import redis
import simplejson as json
from flask_restful import Resource, reqparse

from models.alert_model import AlertWidgetModel
from models.attribute_range import AttributeRange


class PushAlert(Resource):
    """
    Create a push alert. Use a  SSE (Server Side Event) to push alert
    notifications to the client side.

    A GET request is use to create a socket between server and client. A redis
    subject is created using the user_id. 'widget_alert/<user_id>'.

    The following parameters are required in the query string of the GET
    request.
     * user_id:  The user Id.
    """
    red = redis.StrictRedis()

    def __init__(self):
        """ Instantiate Reqparser """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument("user_id", type=int, required=True)

    def event_stream(self, user_id: int) -> str:
        """
        Create SSE (Server Side Event) stream generator to push data to client.
        :param user_id: User Id
        :return: Alert details as a str
        """
        pubsub = self.red.pubsub()
        pubsub.subscribe('widget_alert/{}'.format(user_id))
        # TODO: handle client disconnection.
        for message in pubsub.listen():
            try:
                json.loads(message['data'])
            except (ValueError, TypeError):
                message['data'] = dict(message="Alert ServerEvent Enabled",
                                       user_id=user_id,
                                       subject='widget_alert/{}'.format(
                                           user_id)
                                       )
            yield 'data: %s\n\n' % message['data']
        pubsub.close()

    @classmethod
    def check_alerts(cls, attribute_range: AttributeRange) -> Union[
        NoReturn, tuple]:
        """
        Check if any of the alert thresholds have been exceeded and publish
        the alerts that have been exceeded to the redis subject.
        :param attribute_range: Attribute range
        :return: None on success, otherwise an error
               message with an HTTP status code 400 (Bad Request)
        """
        if not attribute_range:
            # Return error Attribute range is None
            return (dict(error="Attribute is None"),
                    HTTPStatus.BAD_REQUEST
                    )

        # Check Alerts
        max_alerts = AlertWidgetModel.get_max_alerts(attribute_range)
        for max_alert in max_alerts:
            # Publish Maximum Threshold Alerts that were exceeded
            cls.red.publish('widget_alert/{}'.format(max_alert["user_id"]),
                            json.dumps(max_alert))

        min_alerts = AlertWidgetModel.get_min_alerts(attribute_range)
        for min_alert in min_alerts:
            # Publish Minimum Threshold Alerts that were exceeded
            cls.red.publish('widget_alert/{}'.format(min_alert["user_id"]),
                            json.dumps(min_alert))

    def get(self) -> flask.Response:
        """
        Create socket for SSE (Server Side Event).
        :return: SSE (Server Side Event) Socket data generator
        """
        args = self.reqparser.parse_args()
        return flask.Response(self.event_stream(args["user_id"]),
                              mimetype="text/event-stream")
