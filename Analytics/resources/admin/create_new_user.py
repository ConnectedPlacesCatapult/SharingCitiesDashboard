
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


class CreateNewUser(Resource):

    def __init__(self):

        # Create User (Post request parser)
        self.post_reqparser = reqparse.RequestParser()
        self.post_reqparser.add_argument('email', required=True, help='email is required', location=['form', 'json'])
        self.post_reqparser.add_argument('fullname', required=True, help='fullname is required', location=['form', 'json'])
        self.post_reqparser.add_argument('admin', required=True, help='User level is required', location=['form', 'json'])
        self.post_reqparser.add_argument('password', required=False, location=['form', 'json'])

        # From the request headers
        self.post_reqparser.add_argument('Authorization', location='headers')

        super().__init__()

    # Creates a hash from plain text password with salt
    def _hash_password(self, plain_password):
        return bcrypt.hashpw(plain_password, bcrypt.gensalt())

    # Checks if user email exsists in table
    @staticmethod
    def _does_user_exsist(email=None):
        if not email:
            return abort(HTTPStatus.BAD_REQUEST.value, error='email not supplied')
        try:
            user_exsists = Users.find_by_email(email)
        except exc.SQLAlchemyError as error:
            return abort(HTTPStatus.BAD_REQUEST.value, jsonify({'error': error}))
        return user_exsists is not None



    # Creates a new user entry in the database table users
    @jwt_required
    def post(self):

        '''Creates a user (POST METHOD)
            Required:   User needs to have administration privileges to create a user.
                        Content-Type:   application/json
                        Content:        JSON {  "email": "<users email address>(String)",
                                                "fullname": "<users fullname>(String)",
                                                "admin": "<is the user an Admin (Boolean)>"
                                            }
                        Headers:
                        Authorization: Bearer <JWT Token>



            Returns:    JSON with status of request
        '''

        args = self.post_reqparser.parse_args()

        # User needs admin rights to continue
        if not get_jwt_claims()['admin']:
            abort(HTTPStatus.FORBIDDEN.value, error="administration privileges required")

        # Check email address supplied is actually an email address
        args["email"].lower()
        if not Users.email_regex_checker(args["email"]):
            abort(HTTPStatus.BAD_REQUEST.value, error="{} is not a valid email".format(args["email"]))

        # Is the user email already registered
        if self._does_user_exsist(args["email"]):
            abort(HTTPStatus.BAD_REQUEST.value, error='User email exists. email address must be unique')

        print("got here ---------------------------------------3-----------------------------")
        # Create new user database entry in users table
        try:
            hashed_password = Users.generate_hash(args["password"].encode("utf-8")).decode("utf-8")
            new_user = Users(args["fullname"], args["email"], hashed_password, bool(args["admin"]), False)
            new_user.save()
            new_user.commit()
        except Exception as e:
            abort(HTTPStatus.BAD_REQUEST.value, error=e, admin=get_jwt_claims()['admin'])

        return ({"user": "User {} created successfully".format(args["email"])}), 201


