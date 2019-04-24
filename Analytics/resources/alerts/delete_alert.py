from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_claims, get_jwt_identity
from flask_restful import Resource
from flask_restful import reqparse

from models.alert_model import AlertWidgetModel
from models.users import Users


class DeleteAlerts(Resource):

    def __init__(self) -> None:
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('id', required=False, type=int,
                                    store_missing=False)
        self.reqparser.add_argument('user_id', required=False, type=int,
                                    store_missing=False)
        self.reqparser.add_argument('attribute_id', required=False, type=str,
                                    store_missing=False)

    @jwt_required
    def post(self):
        args = self.reqparser.parse_args()

        # Check minimum arguments required for a deletion are present
        if all(arg not in args for arg in
               ["user_id", "attribute_id", "id"]):
            # Return error, Not enough arguments to make a deletion
            return (dict(
                error="Insufficient Arguments",
                possible_args="user_id, attribute_id, alert_id"),
                    HTTPStatus.BAD_REQUEST)

        # Check if a user_id was supplied, if not get current user_id
        if "user_id" not in args:
            user = Users.find_by_email(get_jwt_identity())
            if user:
                args["user_id"] = user.id
            else:
                # Unable to resolve user_id return error
                return (dict(error="Cannot resolve user id"),
                        HTTPStatus.INTERNAL_SERVER_ERROR)

        # Get Alerts
        print(args)
        alerts = AlertWidgetModel.get_by_kwargs(**args)

        for alert in alerts:
            print(alert.json)
            alert.delete()
            alert.commit()
            print(alert.json)


        return [alert.json for alert in alerts], 200
