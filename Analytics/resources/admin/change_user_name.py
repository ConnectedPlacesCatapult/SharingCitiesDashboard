
from http import HTTPStatus

import bcrypt
from flask import jsonify
from flask_jwt_extended import get_jwt_claims
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import abort
from flask_restful import reqparse
from sqlalchemy import exc

from models.users import Users


class ChangeUserName(Resource):

    def __init__(self):

        # Create User (Post request parser)
        self.post_reqparser = reqparse.RequestParser()
        self.post_reqparser.add_argument('email', required=True, help='email is required', location=['form', 'json'])
        self.post_reqparser.add_argument('fullname', required=True, help='fullname is required', location=['form', 'json'])

    @jwt_required
    def post(self):
        """
        Changes users fullname

        """
        args = self.post_reqparser.parse_args()
        user = Users.find_by_email(args["email"])
        if not user:
            abort(HTTPStatus.NOT_FOUND.value, error='User not found.')
        user.fullname = args["fullname"]
        user.save()
        user.commit()
        return "", 204
