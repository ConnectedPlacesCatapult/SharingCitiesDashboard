from http import HTTPStatus

from flask_jwt_extended import get_jwt_claims
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import abort
from flask_restful import inputs
from flask_restful import reqparse

from models.users import Users


class UserPermissions(Resource):

    """ API resource class which updates a users admin and/or activated field

        Parameters can be passed using a POST request that contains a JSON with the following fields:
        :required: valid access JWT where the admin claim has to be true
        :param email: users email address
        :param activated: the value of the user's activated field
        :param admin: whether the the value of the user's activated field
        :type email: string
        :type activated: string
        :type admin: string
        :return: The user's credentials on success or an error message and corresponding status code when unsuccessful
        :rtype: JSON

    """


    def __init__(self):
        # Post request parser
        self.post_reqparser = reqparse.RequestParser()
        self.post_reqparser.add_argument('email', required=True, location=['form', 'json'])
        self.post_reqparser.add_argument('activated', location=['form', 'json'])
        self.post_reqparser.add_argument('admin', location=['form', 'json'])

        super().__init__()


    @jwt_required
    def post(self):
        args = self.post_reqparser.parse_args()

        # User needs admin rights to continue
        if not get_jwt_claims()['admin']:
            abort(HTTPStatus.FORBIDDEN.value, error="administration privileges required")

        # Get user instance
        user = Users.find_by_email(args["email"])
        if not user:
            return abort(HTTPStatus.BAD_REQUEST.value, error='User not found')

        if "activated" in args:
            user.activated = inputs.boolean(args["activated"])

        if "admin" in args:
            user.admin = inputs.boolean(args["admin"])

        # Save changes to user permissions
        user.save()
        user.commit()
        return user.json(), HTTPStatus.OK.value
