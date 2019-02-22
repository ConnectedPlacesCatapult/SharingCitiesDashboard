from http import HTTPStatus
import logging

from flask_jwt_extended import get_jwt_claims
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import abort
from flask_restful import reqparse
from sqlalchemy import exc

from models.users import Users


class DeleteUser(Resource):
    """
    API resource class which deletes a user from the database
    Parameters can be passed using a DELETE request that contains a JSON with the following fields:
    :required: valid access JWT where the admin claim has to be true
    :param email: users email address
    :type email: string
    """

    def __init__(self):
        """
        Instanciates the delete user endpoint
        Parameters can be passed using a DELETE request that contains a JSON with the following fields:
        :required: valid access JWT where the admin claim has to be true
        :param email: users email address
        :type email: string
        :return: An empty string and a 204 response on success or an error message and relevant status code when unsuccessful
        """
        self.delete_reqparser = reqparse.RequestParser()
        self.delete_reqparser.add_argument('email', required=True, location=['form', 'json'])
        logging.basicConfig(filename='event.log', level=logging.DEBUG)
        super().__init__()

    @jwt_required
    def post(self) -> tuple:
        """
        API resource class which deletes a user from the database

        Parameters can be passed using a DELETE request that contains a JSON with the following fields:
        :required: valid access JWT where the admin claim has to be true
        :param email: users email address
        :type email: string
        :return: An empty string and a 204 response on success or an error message and relevant status code when unsuccessful
        """
        args = self.delete_reqparser.parse_args()

        # User needs admin rights to continue
        if not get_jwt_claims()['admin']:
            abort(HTTPStatus.FORBIDDEN.value, error="administration privileges required")

        # Get user instance
        user = Users.find_by_email(args["email"])

        if not user:
            return abort(HTTPStatus.BAD_REQUEST.value, error='user not found')

        try:
            # Remove the user
            user.delete()
            user.commit()
        except exc.SQLAlchemyError as e:
            logging.debug(e, HTTPStatus.BAD_REQUEST.value, error="User not removed")
            abort(HTTPStatus.BAD_REQUEST.value, error="User not removed")

        return "", 204
