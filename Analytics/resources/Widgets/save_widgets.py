import logging
from http import HTTPStatus

from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_restful import Resource, inputs
from flask_restful import abort
from flask_restful import reqparse
from sqlalchemy import exc

from db import db
from models.users import Users
from models.widget import WidgetModel
from models.widget_layout import Layouts

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class Widgets(Resource):
    """ Create or Update Widget """

    def __init__(self) -> None:
        """
        Initiate the reqparser
        """
        self.reqparse_post = reqparse.RequestParser()
        self.reqparse_post.add_argument('data', help='data required',
                                        required=True,
                                        location=['form', 'json'])
        self.reqparse_post.add_argument("widget_id", required=False,
                                        store_missing=False,
                                        location=['form', 'json'])
        self.reqparse_post.add_argument("x", required=False,
                                        store_missing=False,
                                        location=['form', 'json'])
        self.reqparse_post.add_argument("y", required=False,
                                        store_missing=False,
                                        location=['form', 'json'])
        self.reqparse_post.add_argument("h", required=False,
                                        store_missing=False,
                                        location=['form', 'json'])
        self.reqparse_post.add_argument("w", required=False,
                                        store_missing=False,
                                        location=['form', 'json'])
        self.reqparse_post.add_argument("static", store_missing=False,
                                        type=inputs.boolean,
                                        required=False,
                                        help='Widget layout: error passing static variable',
                                        location=['form', 'json'])
        super().__init__()

    @jwt_required
    def post(self) -> (str, int):
        """
        Save or Update a Widget
        Parameters can be passed using a POST request.
        POST request JSON body parameters:
            :param data:  Widget JSON data
            :param widgetID: Widget Id
            :param x: x coordinate of the widget layout
            :param y: y coordinate of the widget layout
            :param h: height of the widget layout
            :param w: width of the widget layout
            :param static: layout static property
        :returns : A response message and an appropriate HTTP status code
        """
        args = self.reqparse_post.parse_args()
        current_user = Users.find_by_email(get_jwt_identity())
        curr_widget = None

        if "widget_id" in args:
            curr_widget = WidgetModel.get_widget_by_id_and_user_id(
                args["widget_id"], current_user.id)

            if curr_widget:
                curr_widget.data = args["data"]
            else:
                abort(HTTPStatus.NOT_FOUND,
                      error="Widget with Id {} not found".format(
                          args["widget_id"]))

        else:
            # Create a layout for the new widget
            layout = Layouts(1, 0, 0, 5,
                             10, False)
            curr_widget = WidgetModel(current_user.id, layout, args["data"])

        try:
            db.session.add(curr_widget)
            # flush session to get new widgetID to assign to layout
            db.session.flush()
            self.update_layout(curr_widget, args)
            db.session.commit()
        except exc.SQLAlchemyError as e:
            logger.error(e.with_traceback(e.__traceback__))
            abort(HTTPStatus.BAD_REQUEST.value,
                  error="exc.SQLAlchemyError: create_widget")
        response = self.get_reponse_template(curr_widget,
                                             updated="widget_id" in args)
        return response, HTTPStatus.CREATED

    def update_layout(self, widget: db.Model, parsed_args: dict()) -> None:
        """
        Update Layout values
        :param widget: Widget instance
        :param parsed_args: The parsed arguments in the HTTP request
        """
        layout = widget.layout
        layout.widget_id = widget.id
        if "x" in parsed_args:
            layout.x_coord = parsed_args["x"]

        if "y" in parsed_args:
            layout.y_coord = parsed_args["y"]

        if "h" in parsed_args:
            layout.height = parsed_args["h"]

        if "w" in parsed_args:
            layout.width = parsed_args["w"]

        if "static" in parsed_args:
            layout.static = parsed_args["static"]

    def get_reponse_template(self, widget: db.Model,
                             updated: bool = False) -> dict:
        """
        Created HTTP Response message
        :param widget: Widget instance that was created or updated
        :param updated: was the widget created or updated? True if the widget
                        was updated. False if the widget was created
        :return: HTTP Response message
        """
        layout = widget.layout
        widget_no_data = widget.json()
        widget_no_data.pop('data')

        return dict(
            msg="Widget Created." if updated is False else "Widget Updated.",
            widget=widget_no_data)
