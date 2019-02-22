from http import HTTPStatus
import logging

from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import abort
from flask_restful import reqparse
from sqlalchemy import exc

from db import db
from models.users import Users
from models.widget import WidgetModel
from models.widget_layout import Layouts


class Widgets(Resource):
    """
    Saves a widget to the database with a userID
    Parameters can be passed using a POST request that contains a JSON with the following fields:
    :param  userID: Unique user identification number
    :param  data: the widgets data

    :type  userID: Integer
    :type  data: JSON

    :returns : a message containing the widget id with a satus code 200 on success
    """

    def __init__(self):
        """
        Initiates the widgets resource
        Parameters can be passed using a POST request that contains a JSON with the following fields:
        :argument data:   widgets JSON data string recieved through a post request
        :type: RequestParser
        """
        # Post request arguments parser ( Save widget)
        self.reqparse_post = reqparse.RequestParser()
        self.reqparse_post.add_argument('data', help='data required', required=True, location=['form', 'json'])
        logging.basicConfig(filename='event.log', level=logging.DEBUG)
        super().__init__()

    @jwt_required
    def post(self) -> tuple:
        """
        Saves a widget to the database with a userID
        Parameters can be passed using a POST request that contains a JSON with the following fields:
        :param  userID: Unique user identification number
        :param  data: the widgets data

        :type  userID: Integer
        :type  data: JSON

        :returns : a message containing the widget id with a satus code 200 on success
        """
        args = self.reqparse_post.parse_args()
        current_user = Users.find_by_email(get_jwt_identity())

        # Create a default layout for the new widget
        layout = Layouts(1, 0, 0, 5, 5, False)
        new_widget = WidgetModel(current_user.id, layout, args["data"])

        try:
            db.session.add(new_widget)
            # flush session to get new widgetID to assign to layout
            db.session.flush()
            layout.widget_id = new_widget.id
            db.session.commit()
        except exc.SQLAlchemyError as e:
            logging.debug(e, status_code=HTTPStatus.BAD_REQUEST.value, error="exc.SQLAlchemyError: create_widget")
            abort(HTTPStatus.BAD_REQUEST.value, error="exc.SQLAlchemyError: create_widget")

        layout.widget_id = new_widget.id
        return "Widget with id: {} saved".format(new_widget.id), HTTPStatus.OK.value
