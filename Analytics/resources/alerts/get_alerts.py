from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import reqparse


from models.alert_model import AlertWidgetModel


class GetAlerts(Resource):

    def __init__(self) -> None:
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('user_id', required=False, type=int,
                                    store_missing=False)
        self.reqparser.add_argument('attribute_id', required=False, type=str,
                                    store_missing=False)



    @jwt_required
    def get(self):
        args = self.reqparser.parse_args()

        alerts = AlertWidgetModel.get_by_kwargs(**args)

        response_models = list()
        for alert in alerts:
            response_models.append(alert.json)

        return response_models, 200

