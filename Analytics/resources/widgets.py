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


class Widgets(Resource):

    def __init__(self):

        # Post request arguments parser ( Save widget)
        self.reqparse_post = reqparse.RequestParser()
        self.reqparse_post.add_argument('userID', help='userID required', location=['form', 'json'])
        self.reqparse_post.add_argument('title', help='config required', location=['form', 'json'])
        self.reqparse_post.add_argument('type', help='type required', location=['form', 'json'])
        self.reqparse_post.add_argument('spec', help='config required', location=['form', 'json'])
        self.reqparse_post.add_argument('tileLayer', location=['form', 'json'])
        self.reqparse_post.add_argument('isHeatMap', location=['form', 'json'])
        self.reqparse_post.add_argument('data', help='config required', location=['form', 'json'])

        # Delete args parser (delete widgets)
        self.reqparser_delete = reqparse.RequestParser()
        self.reqparser_delete.add_argument('userID', required=True, help='A userID is required',
                                           location=['form', 'json'])
        self.reqparser_delete.add_argument('widgetID', required=True, help='widgetID required',
                                           location=['form', 'json'])

        # Get args parser ( Get widgets)
        self.reqparser_get = reqparse.RequestParser()
        self.reqparser_get.add_argument('userID', required=True, help='A user_id is required',
                                        location=['form', 'json'])
        self.reqparser_get.add_argument('limit', default=1, required=False, type=int,
                                        help='Limit needs to be an Integer', location=['form', 'json'])
        super().__init__()

    @jwt_required
    def get(self):
        """ Get one or more widgets from the database with a userID

            :param  userID: Unique user identification number
            :param  limit: the max count of widgets to be returned

            :type userID: Integer
            :type limit: Integer

            :returns [widget]: A list of widgets with a maximum length of limit and a status code 200
            :rtype List(widget): A list of widgets
        """

        args = self.reqparser_get.parse_args()
        widgets = WidgetModel.query.filter_by(user_id=args["userID"]).limit(args["limit"]).all()

        if not widgets:
            abort(HTTPStatus.BAD_REQUEST.value, error="no widgets found")

        widget_list = []
        for widget in widgets:
            widget_list.append(widget.json())

        return widget_list, HTTPStatus.OK.value

    @jwt_required
    def post(self):
        """ Saves a widget to the database with a userID

            :param  userID: Unique user identification number
            :param  title: The title of the widget
            :param  type: The type of the widget
            :param  spec: layout specifications of the widget
            :param  tileLayer: The title of the widget
            :param  isHeatMap: Is the widget a Heat Map
            :param  data: the widgets data

            :type  userID: Integer
            :type  title: String
            :type  type: String
            :type  spec: JSON
            :type  tileLayer: String
            :type  isHeatMap: Boolean
            :type  data: JSON

            :returns : a message containing the widget id and user id with a satus code 200 on success
            :rtype: <class 'tuple'>
        """
        args = self.reqparse_post.parse_args()
        current_user = Users.find_by_email(get_jwt_identity())
        new_widget = WidgetModel(current_user.id, args["title"], args["type"],
                                 args["spec"], args["data"], tile_layer=args["tileLayer"],
                                 is_heat_map=args["isHeatMap"])

        try:
            db.session.add(new_widget)
            db.session.commit()
        except exc.SQLAlchemyError as e:
            print(e.with_traceback(e.__traceback__))
            # return jsonify(args), HTTPStatus.BAD_REQUEST.value

        return "{} Widget with id: {} saved".format(new_widget.title, new_widget.id), HTTPStatus.OK.value

    @jwt_required
    def delete(self):
        """ Delete a widget from the database

            :param  userID: Unique user identification number
            :param  widgetID: Unique widget identification number

            :type userID: Integer
            :type widgetID: Integer

            :returns: A message and a status code of 200
            :rtype: <class 'tuple'>
        """
        args = self.reqparser_delete.parse_args()
        try:
            # user_id=user_id, id=widget_id
            widget = WidgetModel.query.filter_by(id=args["widgetID"], user_id=args["userID"]).delete()
            if not widget:
                abort(HTTPStatus.BAD_REQUEST,
                      error="WidgetID {} with userID {} not found!".format(args["widgetID"], args["userID"]))
            db.session.commit()
        except exc.SQLAlchemyError:
            abort(HTTPStatus.BAD_REQUEST.value)
        return "Widget id: {} deleted".format(args["widgetID"]), HTTPStatus.OK.value

    @classmethod
    def get_by_user_id(cls, user_id, widget_id):
        """ Get a Widget instance by userID and widgetID

                    :param  userID: Unique user identification number
                    :param  widgetID: Unique widget identification number

                    :type userID: Integer
                    :type widgetID: Integer

                    :returns: An instance of a widget with an id of widgetID and userID
                    :rtype: <class 'tuple'>
                """
        return WidgetModel.query.filter_by(user_id=user_id, id=widget_id)
