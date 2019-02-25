from http import HTTPStatus

import bcrypt
from flask import jsonify
from flask_jwt_extended import get_jwt_claims
from flask_jwt_extended import jwt_required
from flask_restful import Resource, inputs
from flask_restful import abort
from flask_restful import reqparse
from sqlalchemy import exc

from models.users import Users


class CreateNewUser(Resource):
    """
    API resource class which creates a new user and adds it to the database
    Parameters can be passed using a POST request that contains a JSON with the following fields:
    :required: valid access JWT where the admin claim has to be true
    :param email: users email address
    :param fullname: users fullname
    :param admin: whether the user will be an admin user or not
    :param password: users password
    :type email: str
    :type fullname: str
    :type admin: str
    :type password: str
    :return: A message indicating a successful or unsuccessful addition of user to the database
     """

    def __init__(self) -> None:
        """
        Instantiates the create user endpoint
        Parameters can be passed using a POST request that contains a JSON with the following fields:
        :required: valid access JWT where the admin claim has to be true
        :param email: users email address
        :param fullname: users fullname
        :param admin: whether the user will be an admin user or not
        :param password: users password
        :type email: str
        :type fullname: str
        :type admin: str
        :type password: str
        :return: A message indicating a successful or unsuccessful addition of user to the database
         """
        # Create User (Post request parser)
        self.post_reqparser = reqparse.RequestParser()
        self.post_reqparser.add_argument('email', required=True, help='email is required', location=['form', 'json'])
        self.post_reqparser.add_argument('fullname', required=True, help='fullname is required',
                                         location=['form', 'json'])
        self.post_reqparser.add_argument('admin', type=inputs.boolean, required=True, help='User level is required',
                                         location=['form', 'json'])
        self.post_reqparser.add_argument('password', required=False, location=['form', 'json'])
        # Form the request headers
        self.post_reqparser.add_argument('Authorization', location='headers')
        super().__init__()

    def _hash_password(self, plain_password: str) -> bytes:
        """
        Generate a secure hash of the plain string password
        :param plain_password: plain text user password
        :type plain_password: str
        :return: hash of password
        """
        return bcrypt.hashpw(plain_password, bcrypt.gensalt())

    @staticmethod
    def _does_user_exsist(email: str = None) -> bool:
        """
        Checks if a user with the email passed exists
        :param email: users email address
        :type email: str
        :return: true if the user exists otherwise false
        """
        if not email:
            return abort(HTTPStatus.BAD_REQUEST.value, error='email not supplied')
        try:
            user_exsists = Users.find_by_email(email)
        except exc.SQLAlchemyError as error:
            return abort(HTTPStatus.BAD_REQUEST.value, jsonify({'error': error}))
        return user_exsists is not None

    @jwt_required
    def post(self) -> (dict, int):
        """
        API resource class which creates a new user and adds it to the database
        Parameters can be passed using a POST request that contains a JSON with the following fields:
        :required: valid access JWT where the admin claim has to be true
        :param email: users email address
        :param fullname: users fullname
        :param admin: whether the user will be an admin user or not
        :param password: users password
        :type email: str
        :type fullname: str
        :type admin: str
        :type password: str
        :return: A message indicating a successful or unsuccessful addition of user to the database
        """
        args = self.post_reqparser.parse_args()
        # User needs admin rights to continue
        if not get_jwt_claims()['admin']:
            abort(HTTPStatus.FORBIDDEN.value, error="administration privileges required")

        # Check email address supplied is actually an email address
        args["email"].lower()
        # if not Users.email_regex_checker(args["email"]):
        #     abort(HTTPStatus.BAD_REQUEST.value, error="{} is not a valid email".format(args["email"]))

        # Is the user email already registered
        if self._does_user_exsist(args["email"]):
            abort(HTTPStatus.BAD_REQUEST.value, error='User email exists. email address must be unique')

        # Create new user database entry in users table
        try:
            hashed_password = Users.generate_hash(args["password"].encode("utf-8")).decode("utf-8")
            new_user = Users(args["fullname"], args["email"], hashed_password, bool(args["admin"]), False)
            new_user.save()
            new_user.commit()
        except Exception as e:
            abort(HTTPStatus.BAD_REQUEST.value, error=e, admin=get_jwt_claims()['admin'])
        return ({"user": "User {} created successfully".format(args["email"])}), 201
