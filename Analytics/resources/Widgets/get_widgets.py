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


class GetWidgets(Resource):
    """
        Get one or more widgets from the database with a userID

        :param  userID: Unique user identification number
        :param  limit: the max count of widgets to be returned (optional)

        :type userID: Integer
        :type limit: Integer
    """
    def __init__(self):
        # Arguments required to fetch the widgets related to the userID
        self.reqparser_get = reqparse.RequestParser()
        self.reqparser_get.add_argument('userID', required=True, help='A user_id is required',
                                        location=['form', 'json'])
        self.reqparser_get.add_argument('limit', default=1, required=False, type=int,
                                        help='unable to parse limit', location=['form', 'json'])
        super().__init__()

    @jwt_required
    def post(self):
        """
            Get one or more widgets from the database with a userID

            :param  userID: Unique user identification number
            :param  limit: the max count of widgets to be returned

            :type userID: Integer
            :type limit: Integer

            :returns [widget]: A list of widgets with a maximum length of limit and a status code 200
            :rtype List(widget): A list of widgets
        """

        args = self.reqparser_get.parse_args()
        # Fetch the widget instances related to the userID passed
        widgets = WidgetModel.query.filter_by(user_id=args["userID"]).limit(args["limit"]).all()

        # Were widget instances returned
        if not widgets:
            # No widgets found for userID
            abort(HTTPStatus.NOT_FOUND.value, error="no widgets found for userID {}".format(args["userID"]))

        # Store widgets to be returned
        widget_list = []

        for widget in widgets:
            widget = WidgetModel.get_widget_by_id(widget.id)
            # Format widget data for response
            widget_list.append(widget.json())

        return widget_list, HTTPStatus.OK.value
