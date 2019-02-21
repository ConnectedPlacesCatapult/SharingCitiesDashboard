
from http import HTTPStatus

from flask_jwt_extended import get_jwt_claims
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import abort
from flask_restful import reqparse
from sqlalchemy import exc

from models.users import Users


class DeleteUser(Resource):

    def __init__(self):

        # Remove User (Delete request parser)
        self.delete_reqparser = reqparse.RequestParser()
        self.delete_reqparser.add_argument('email', required=True, location=['form', 'json'])

        super().__init__()

    # Removes a user from the database table users
    @jwt_required
    def delete(self):
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
        except exc.SQLAlchemyError:
            abort(HTTPStatus.BAD_REQUEST.value, error="User not removed")

        return "", 204
