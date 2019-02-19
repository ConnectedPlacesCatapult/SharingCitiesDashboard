from http import HTTPStatus

from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import abort
from flask_restful import reqparse

from models.users import Users


class GetUserByEmail(Resource):
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
