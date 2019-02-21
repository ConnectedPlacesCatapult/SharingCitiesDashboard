from http import HTTPStatus

from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import abort
from flask_restful import reqparse

from models.users import Users


class GetUserByEmail(Resource):
    """ API resource class which returns a user from the database

        Parameters can be passed using a GET request that contains the following fields in the url:
        :required: valid access JWT where the admin claim may be true or false
        :param email: users email address
        :type email: string
        :return: The user's credentials on success or an error message and relevant status code when unsuccessful
        :rtype: JSON
    """

    def __init__(self):
        # Post request parser
        self.get_reqparser = reqparse.RequestParser()
        self.get_reqparser.add_argument('email', required=True, location=['form', 'json'])

    @jwt_required
    def post(self):
        args = self.get_reqparser.parse_args()
        user = Users.find_by_email(args["email"])

        if not user:
            return abort(HTTPStatus.BAD_REQUEST.value, error='User not found')

        return user.json(), HTTPStatus.OK.value
