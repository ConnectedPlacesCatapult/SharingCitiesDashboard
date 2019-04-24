from http import HTTPStatus

from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import inputs
from flask_restful import reqparse

from models.alert_model import AlertWidgetModel
from models.users import Users


class CreateAlert(Resource):

    def __init__(self) -> None:
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('user_id', required=True, type=int,
                                    help='User Id missing',
                                    location=['form', 'json'])
        self.reqparser.add_argument('widget_id', required=True, type=int,
                                    help='User Id missing',
                                    location=['form', 'json'])
        self.reqparser.add_argument('activated', required=False,
                                    type=inputs.boolean,
                                    default=True,
                                    location=['form', 'json'])
        self.reqparser.add_argument('attribute_id', required=True, type=str,
                                    help='Attribute Id missing',
                                    location=['form', 'json'])
        self.reqparser.add_argument('max_threshold', required=False,
                                    type=float,
                                    help='Max Threshold Value missing',
                                    location=['form', 'json'])
        self.reqparser.add_argument('min_threshold', required=False,
                                    type=float,
                                    help='Min Threshold Value missing',
                                    location=['form', 'json'])

    @jwt_required
    def post(self):
        args = self.reqparser.parse_args()

        if not Users.find_by_id(args["user_id"]):
            return dict(error="User id {} not found".format(
                args["user_id"])), HTTPStatus.NOT_FOUND

        if "max_threshold" not in args and "min_threshold" not in args:
            return dict(
                error="Threshold value required"), HTTPStatus.BAD_REQUEST

        alertModel = AlertWidgetModel(args["user_id"], args["widget_id"],
                                      args["attribute_id"],
                                      args["max_threshold"],
                                      args["min_threshold"], args["activated"])
        if not alertModel:
            return dict(error="Unable to create Alert", args=args), \
                   HTTPStatus.INTERNAL_SERVER_ERROR

        alertModel.save()
        alertModel.commit()
        return dict(id=alertModel.id), HTTPStatus.CREATED
