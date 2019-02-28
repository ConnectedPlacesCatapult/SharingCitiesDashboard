from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource
from flask_restful import reqparse

from models.theme import SubTheme
from models.theme import Theme


class DeleteTheme(Resource):
    """
    delete an existing Theme entry in the database
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
        Delete an existing Theme entry in the database.
        :post_argument  name: the name of the theme to be deleted.
        :post_argument id: id of the theme to be deleted.
        :post_type  name: str
        :post_type  id: str
        """
        if not get_jwt_claims()['admin']:
            return {"error": "administration privileges required"}, HTTPStatus.FORBIDDEN

        # Get arguments
        args = self.reqparser.parse_args()

        # does the theme exist?
        theme = Theme.get_by_name(args["name"]) if "name" in args else Theme.get_by_id(args["id"])
        if not theme:
            # cannot delete a theme that does not exist.
            return {'error': 'Theme does not exists.', 'id': " ", 'name': args["name"]}, HTTPStatus.BAD_REQUEST

        sub_themes = SubTheme.get_by_theme_id(theme.id)
        for sub_theme in sub_themes:
            sub_theme.delete()
            sub_theme.commit()

        # delete the theme
        theme.delete()
        theme.commit()

        return "", HTTPStatus.NO_CONTENT
