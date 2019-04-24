from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_claims, get_jwt_identity
from flask_restful import Resource
from flask_restful import reqparse

from models.alert_model import AlertWidgetModel
from models.users import Users


class DeleteAlerts(Resource):

    def __init__(self) -> None:
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('alert_id', required=False, type=int,
                                    help='User Id missing')
        self.reqparser.add_argument('user_id', required=False, type=int,
                                    help='User Id missing')
        self.reqparser.add_argument('attribute_id', required=False, type=str,
                                    help='Attribute Id missing')

    @jwt_required
    def post(self):
        args = self.reqparser.parse_args()
        if all(arg not in args for arg in
               ["user_id", "attribute_id", "alert_id"]):
            return (dict(
                error="Insufficient Arguments",
                possible_args="user_id, attribute_id, alert_id"),
                    HTTPStatus.BAD_REQUEST)
        if "user_id" not in args:
            user = Users.find_by_email(get_jwt_identity())
            if user:
                args["user_id"] = user.id
        return "",200
        max_alerts = AlertWidgetModel.get_max_alerts(
            args["attribute_id"], args["value"])

        min_alerts = AlertWidgetModel.get_min_alerts(
            args["attribute_id"], args["value"])

        return dict(max=max_alerts, min=min_alerts), 200
