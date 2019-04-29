from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import reqparse

from models.alert_model import AlertWidgetModel


class CheckAlerts(Resource):

    def __init__(self) -> None:
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('user_id', required=False, type=int,
                                    help='User Id missing')
        self.reqparser.add_argument('attribute_id', required=True, type=str,
                                    help='Attribute Id missing')
        self.reqparser.add_argument('value', required=True, type=float,
                                    help='Value missing')

    @jwt_required
    def get(self):
        args = self.reqparser.parse_args()

        max_alerts = AlertWidgetModel.get_max_alerts(
            args["attribute_id"], args["value"])

        min_alerts = AlertWidgetModel.get_min_alerts(
            args["attribute_id"], args["value"])

        return dict(max=max_alerts, min=min_alerts), 200
