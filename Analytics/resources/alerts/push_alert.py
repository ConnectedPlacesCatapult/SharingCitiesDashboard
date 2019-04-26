# !/usr/bin/env python
from http import HTTPStatus

import flask
import redis
import simplejson as json
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity

from models.alert_model import AlertWidgetModel
from models.attribute_range import AttributeRange
from models.users import Users

red = redis.StrictRedis()


class PushAlert(Resource):

    def __init__(self):
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument("user_id", type=int, required=True)

    def event_stream(self, user_id: int):
        pubsub = red.pubsub()
        pubsub.subscribe('widget_alert/{}'.format(user_id))
        # TODO: handle client disconnection.
        for message in pubsub.listen():
            try:
                json.loads(message['data'])
            except (ValueError, TypeError):
                message['data'] = dict(message="Alert ServerEvent Enabled",
                                       user_id=user_id,
                                       subject='widget_alert/{}'.format(user_id)
                                       )
            yield 'data: %s\n\n' % message['data']
        pubsub.close()

    # @staticmethod
    # def check_alerts():
    #     # Get Attribute Max and Minimums
    #     attribute_ranges = AttributeRange.get_all()
    #
    #     if not attribute_ranges:
    #         # Return eroor Attribute range not found
    #         return (dict(error="Attribute range entries found"),
    #                 HTTPStatus.NOT_FOUND)
    #
    #     max_alerts = []
    #     min_alerts = []
    #     for attribute_range in attribute_ranges:
    #         # Check Alerts
    #         new_max_alert = AlertWidgetModel.get_max_alerts(
    #             attribute_range.attribute_id, attribute_range)
    #         if new_max_alert:
    #             max_alerts.append(new_max_alert)
    #
    #         new_min_alert = AlertWidgetModel.get_min_alerts(
    #             attribute_range.attribute_id, attribute_range)
    #         if new_min_alert:
    #             min_alerts.append(new_min_alert)
    #
    #     if max_alerts or min_alerts:
    #         alerts = dict(min=min_alerts,
    #                       max=max_alerts)
    #         red.publish('widget_alert', json.dumps(alerts))

    @staticmethod
    def check_alerts():
        # Get Attribute Max and Minimums
        attribute_ranges = AttributeRange.get_all()

        if not attribute_ranges:
            # Return eroor Attribute range not found
            return (dict(error="Attribute range entries found"),
                    HTTPStatus.NOT_FOUND)

        for attribute_range in attribute_ranges:
            # Check Alerts
            max_alerts = AlertWidgetModel.get_max_alerts(attribute_range)
            for max_alert in max_alerts:
                red.publish('widget_alert/{}'.format(max_alert["user_id"]),
                            json.dumps(max_alert))

            min_alerts = AlertWidgetModel.get_min_alerts(attribute_range)
            for min_alert in min_alerts:
                red.publish('widget_alert/{}'.format(min_alert["user_id"]),
                            json.dumps(min_alert))



    def get(self):

        args = self.reqparser.parse_args()
        # user = Users.find_by_email(get_jwt_identity())
        # if user:
        #     return dict(error="User email not found",
        #                 email=get_jwt_identity()), HTTPStatus.NOT_FOUND

        return flask.Response(self.event_stream(args["user_id"]),
                              mimetype="text/event-stream")
