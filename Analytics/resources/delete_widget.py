from http import HTTPStatus

from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource
from flask_restful import abort, inputs
from flask_restful import reqparse
from sqlalchemy import exc

from db import db
from models.users import Users
from models.widget import WidgetModel


class DeleteWidgets(Resource):

    def __init__(self):
        # Delete args parser (delete widgets)
        self.reqparser_delete = reqparse.RequestParser()
        self.reqparser_delete.add_argument('userID', required=True, help='A userID is required',
                                           location=['form', 'json'])
        self.reqparser_delete.add_argument('widgetID', required=True, help='widgetID required',
                                           location=['form', 'json'])

        super().__init__()

    @jwt_required
    def post(self):
        """ Delete a widget from the database

            :param  userID: Unique user identification number
            :param  widgetID: Unique widget identification number

            :type userID: Integer
            :type widgetID: Integer

            :returns: A message and a status code of 200
            :rtype: <class 'tuple'>
        """
        args = self.reqparser_delete.parse_args()

        # User must be an admin
        # if not get_jwt_claims()['admin']:
            # abort(HTTPStatus.FORBIDDEN.value, error="administration privileges required")

        try:
            # user_id=user_id, id=widget_id
            widget = WidgetModel.query.filter_by(id=args["widgetID"], user_id=args["userID"]).delete()
            if not widget:
                abort(HTTPStatus.BAD_REQUEST,
                      error="WidgetID {} with userID {} not found!".format(args["widgetID"], args["userID"]))
            db.session.commit()
        except exc.SQLAlchemyError:
            abort(HTTPStatus.BAD_REQUEST.value)

        return "", 204
