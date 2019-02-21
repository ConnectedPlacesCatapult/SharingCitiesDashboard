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


class GetLayouts(Resource):

    def __init__(self):
        # Get args parser ( Get widgets)
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('userID', required=True, help='A userID is required',
                                        location=['form', 'json'])
        self.reqparser.add_argument('limit', required=False, default=10, help='A userID is required',
                                        location=['form', 'json'])
        super().__init__()

    @jwt_required
    def post(self):
        args = self.reqparser.parse_args()
        widgets = WidgetModel.query.filter_by(user_id=args["userID"]).limit(args["limit"]).all()

        if not widgets:
            abort(HTTPStatus.BAD_REQUEST.value, error="no widgets found")

        layout_list = []

        for widget in widgets:
            widget = WidgetModel.get_widget_by_id(widget.id)
            widget.layout.widgetID = widget.id
            layout_list.append(widget.layout.json())

        return layout_list, HTTPStatus.OK.value

