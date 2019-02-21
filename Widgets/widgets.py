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


        super().__init__()



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

        layout = Layouts(1, 0, 0, 5, 5, False)
        new_widget = WidgetModel(current_user.id, layout, args["title"], args["type"],
                                 args["spec"], args["data"], tile_layer=args["tileLayer"],
                                 is_heat_map=inputs.boolean(args["isHeatMap"]))





        try:
            db.session.add(new_widget)
            db.session.flush()
            layout.widget_id = new_widget.id
            db.session.commit()
        except exc.SQLAlchemyError:
            return "", HTTPStatus.BAD_REQUEST.value

        layout.widget_id = new_widget.id
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

    @classmethod
    def get_by_widget_id(cls,widget_id):
        """ Get a Widget instance by userID and widgetID

                    :param  userID: Unique user identification number
                    :param  widgetID: Unique widget identification number

                    :type userID: Integer
                    :type widgetID: Integer

                    :returns: An instance of a widget with an id of widgetID and userID
                    :rtype: <class 'tuple'>
                """
        return WidgetModel.query.filter_by(id=widget_id).first()
