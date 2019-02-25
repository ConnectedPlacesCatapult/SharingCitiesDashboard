import logging
from http import HTTPStatus

from flask_jwt_extended import get_jwt_claims
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import abort
from flask_restful import reqparse
from sqlalchemy import exc

from models.users import Users

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class DeleteUser(Resource):
    """
    API resource class which deletes a user from the database
    Parameters can be passed using a DELETE request that contains a JSON with the following fields:
    :required: valid access JWT where the admin claim has to be true
    :param email: users email address
    :type email: str
    """

    def __init__(self) -> None:
        """
        Instanciates the delete user endpoint
        Parameters can be passed using a DELETE request that contains a JSON with the following fields:
        :required: valid access JWT where the admin claim has to be true
        :param email: users email address
        :type email: str
        :return: An empty string and a 204 response on success or an error message and relevant status code when unsuccessful
        """
        self.delete_reqparser = reqparse.RequestParser()
        self.delete_reqparser.add_argument('email', required=True, location=['form', 'json'])
        super().__init__()

    @jwt_required
    def post(self) -> (str, int):
        """
        API resource class which deletes a user from the database

        Parameters can be passed using a DELETE request that contains a JSON with the following fields:
        :required: valid access JWT where the admin claim has to be true
        :param email: users email address
        :type email: str
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
            logging.critical(e, HTTPStatus.BAD_REQUEST.value, error="User not removed")
            abort(HTTPStatus.BAD_REQUEST.value, error="User not removed")

        return "", 204
