from http import HTTPStatus

from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import abort
from flask_restful import reqparse

from models.users import Users


class GetUserByEmail(Resource):
    """
    API resource class which returns a user from the database
    Parameters can be passed using a GET request that contains the following fields in the url:
    :required: valid access JWT where the admin claim may be true or false
    :param email: users email address
    :type email: string
    :return: The user's credentials on success or an error message and relevant status code when unsuccessful
    """

    def __init__(self):
        """
        Instantiates the get user endpoint
        Parameters can be passed using a POST request that contains the following fields in the url:
        :required: valid access JWT where the admin claim may be true or false
        :param email: users email address
        :type email: string
        """
        # Post request parser
        self.get_reqparser = reqparse.RequestParser()
        self.get_reqparser.add_argument('email', required=True, location=['form', 'json'])

    @jwt_required
    def post(self) -> tuple:
        """
        API resource class which returns a user from the database
        Parameters can be passed using a POST request that contains the following fields in the url:
        :required: valid access JWT where the admin claim may be true or false
        :param email: users email address
        :type email: string
        :return: The user's credentials on success or an error message and relevant status code when unsuccessful
        """
        args = self.get_reqparser.parse_args()
        # Fetch user from database using the users email
        user = Users.find_by_email(args["email"])

        if not user:
            # No user with that email address
            return abort(HTTPStatus.BAD_REQUEST.value, error='User not found')
        return user.json(), HTTPStatus.OK.value
