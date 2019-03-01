from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource
from flask_restful import reqparse

from models.theme import SubTheme


class DeleteSubTheme(Resource):
    """
    delete an existing sub theme entry in the database
    """
    def __init__(self) -> None:
        """
        Sets the required arguments to be in the POST request
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('name', required=False, store_missing=False, type=str, location=['form', 'json'])
        self.reqparser.add_argument('id', required=False, store_missing=False, type=str, location=['form', 'json'])

    @jwt_required
    def post(self) -> ({str: str}, HTTPStatus):
        """
        Delete an existing sub theme entry in the database.
        :post_argument  name: the name of the sub theme to be deleted.
        :post_argument id: id of the sub theme to be deleted.
        :post_type  name: str
        :post_type  id: str
        :returns: A no content with a http status code of 204, otherwise a JSON of the error details
                  and the appropriate http status code
        """
        if not get_jwt_claims()['admin']:
            return {"error": "administration privileges required"}, HTTPStatus.FORBIDDEN

        # Get arguments
        args = self.reqparser.parse_args()

        # does the theme exist?
        subtheme = SubTheme.get_by_name(args["name"]) if "name" in args else SubTheme.get_by_id(args["id"])
        if not subtheme:
            # cannot delete a theme that does not exist.
            return {'error': 'Sub-theme does not exists.', 'id': " ", 'name': args["name"]}, HTTPStatus.BAD_REQUEST

        # delete the theme
        subtheme.delete()
        subtheme.commit()

        return "", HTTPStatus.NO_CONTENT
