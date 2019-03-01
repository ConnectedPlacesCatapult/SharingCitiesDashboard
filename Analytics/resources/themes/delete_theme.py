from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource
from flask_restful import reqparse

from models.theme import SubTheme
from models.theme import Theme


class DeleteTheme(Resource):
    """
    Delete an existing Theme
    """

    def __init__(self) -> None:
        """
        Set required arguments for POST request
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('name', required=False, store_missing=False, type=str, location=['form', 'json'])
        self.reqparser.add_argument('id', required=False, store_missing=False, type=str, location=['form', 'json'])

    @jwt_required
    def post(self) -> ({str: str}, HTTPStatus):
        """
        Delete an existing Theme.
        :param  name:   name of Theme to delete.
        :param id:      id of Theme to delete.
        :type  name:    str
        :type  id:      str
        :returns: A no content with a http status code of 204, otherwise a JSON of the error details
                  and the appropriate http status code
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
