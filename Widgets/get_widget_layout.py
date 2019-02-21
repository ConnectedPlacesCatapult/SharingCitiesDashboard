from http import HTTPStatus

from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import abort, inputs
from flask_restful import reqparse
from sqlalchemy import exc

from db import db
from models.users import Users
from models.widget import WidgetModel
from models.layout_model import Layouts


class GetWidgetLayout(Resource):

    def __init__(self):
        # Get args parser ( Get widgets)
        self.reqparser_get = reqparse.RequestParser()
        self.reqparser_get.add_argument('widgetID', required=True, help='A widgetID is required',
                                        location=['form', 'json'])
        super().__init__()

    @jwt_required
    def post(self):
        """ Get Widget layout for widgetID

        """

        args = self.reqparser_get.parse_args()
        widget = WidgetModel.query.filter_by(id=args["widgetID"]).first()

        if not widget:
            abort(HTTPStatus.BAD_REQUEST.value, error="no widget found with widgetID: {}".format(args["widgetID"]))
        if not widget.layout:
            abort(HTTPStatus.BAD_REQUEST.value, error="no widget layout found for widgetID: {}".format(args["widgetID"]))

        return widget.layout.json(), HTTPStatus.OK.value
