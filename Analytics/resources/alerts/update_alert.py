from http import HTTPStatus

from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import inputs
from flask_restful import reqparse
from sqlalchemy.exc import IntegrityError

from models.alert_model import AlertWidgetModel


class UpdateAlert(Resource):
    """
    Update an existing alert.
    """

    def __init__(self) -> None:
        """
        Instantiate reparse for POST request.
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('alert_id', required=True, type=int,
                                    help='Alert Id missing',
                                    location=['form', 'json'])
        self.reqparser.add_argument('widget_id', required=False, type=int,
                                    store_missing=False,
                                    location=['form', 'json'])
        self.reqparser.add_argument('activated', required=False,
                                    type=inputs.boolean,
                                    default=True,
                                    location=['form', 'json'])
        self.reqparser.add_argument('attribute_id', required=False, type=str,
                                    store_missing=False,
                                    location=['form', 'json'])
        self.reqparser.add_argument('max_threshold', required=False,
                                    type=float,
                                    store_missing=False,
                                    location=['form', 'json'])
        self.reqparser.add_argument('min_threshold', required=False,
                                    type=float,
                                    store_missing=False,
                                    location=['form', 'json'])

    @jwt_required
    def post(self) -> (dict, HTTPStatus):
        """
        Update an alert.
        :return: On success return the updated alert and an HTTP status code
                200(OK), Otherwise return an error with the appropriate
                HTTP status code
        """
        args = self.reqparser.parse_args()

        alert = AlertWidgetModel.get_by_id(args["alert_id"])
        if not alert:
            return dict(error="Alert with id {} not found.".format(
                args["alert_id"])), HTTPStatus.NOT_FOUND

        for key, value in args.items():
            setattr(alert, key, value)

        try:
            alert.save()
            alert.commit()
        except IntegrityError as ie:
            return dict(error="Failed to update alert id {}".format(
                args["alert_id"])), HTTPStatus.INTERNAL_SERVER_ERROR

        return alert.json, HTTPStatus.OK
