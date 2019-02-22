from http import HTTPStatus

from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import abort
from flask_restful import reqparse
from sqlalchemy import exc

from db import db
from models.widget import WidgetModel


class DeleteWidgets(Resource):
    """
    Delete a widget from the database
    Parameters can be passed using a POST request that contains a JSON with the following fields:
    :param  userID: Unique user identification number
    :param  widgetID: Unique widget identification number

    :type userID: Integer
    :type widgetID: Integer

    :raises SQLAlchemyError: when a SQLAlchemyError is raised a status of code Bad Request (400) and the
            error is returned

    :returns: A message and a status code of No Content (204) when a widget is deleted
              When the widget does not exist in the database table 'widgets' a status code of
              Not Found (404) is returned.
    """

    def __init__(self):
        """
        Initiates the delete widget endpoint
        Parameters can be passed using a POST request that contains a JSON with the following fields:
        :param  userID: Unique user identification number
        :param  widgetID: Unique widget identification number

        :type userID: Integer
        :type widgetID: Integer
        """
        self.reqparser_delete = reqparse.RequestParser()
        self.reqparser_delete.add_argument('userID', required=True, help='A userID is required',
                                           location=['form', 'json'])
        self.reqparser_delete.add_argument('widgetID', required=True, help='widgetID required',
                                           location=['form', 'json'])
        super().__init__()

    @jwt_required
    def post(self) -> tuple:
        """
        Delete a widget from the database
        Parameters can be passed using a POST request that contains a JSON with the following fields:
        :param  userID: Unique user identification number
        :param  widgetID: Unique widget identification number

        :type userID: Integer
        :type widgetID: Integer

        :raises SQLAlchemyError: when a SQLAlchemyError is raised a status of code Bad Request (400) and the
                error is returned

        :returns: A message and a status code of No Content (204) when a widget is deleted
                  When the widget does not exist in the database table 'widgets' a status code of
                  Not Found (404) is returned.
        """
        args = self.reqparser_delete.parse_args()
        try:
            # Get widget instance from db to be delete
            widget = WidgetModel.query.filter_by(id=args["widgetID"], user_id=args["userID"]).first()

            # Does the widget instance exist with the supplied widgetID
            if not widget:
                # The widget with the supplied widgetID does not exist
                abort(HTTPStatus.NOT_FOUND.value,
                      error="WidgetID {} with userID {} not found!".format(args["widgetID"], args["userID"]))
            # the widget exists, therefore delete the widget from the db
            widget.delete()
            db.session.commit()
        except exc.SQLAlchemyError:
            abort(HTTPStatus.BAD_REQUEST.value, error="exc.SQLAlchemyError: delete_widget")

        return "", HTTPStatus.NO_CONTENT.value
