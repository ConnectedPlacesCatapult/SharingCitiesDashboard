from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource
from flask_restful import reqparse

from models.theme import SubTheme


class DeleteSubTheme(Resource):
    """
    Delete an existing SubTheme.
    """

    def __init__(self) -> None:
        """
        Set required arguments for POST request.
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('name', required=False, store_missing=False, type=str, location=['form', 'json'])
        self.reqparser.add_argument('id', required=False, store_missing=False, type=str, location=['form', 'json'])
        self.reqparser.add_argument('theme_id', required=False, store_missing=False, type=str,
                                    location=['form', 'json'])

    @jwt_required
    def post(self) -> ({str: str}, HTTPStatus):
        """
        Delete an existing SubTheme.
        :param  name: the name of SubTheme.
        :param id: id of SubTheme.
        :param theme_id: Parent theme id.
        :type  name: str
        :type  id: str
        :type theme_id: str
        :returns: A no content with a http status code of 204, otherwise a JSON of the error details
                  and the appropriate http status code
        """
        if not get_jwt_claims()['admin']:
            return {"error": "administration privileges required"}, HTTPStatus.FORBIDDEN

        # Get arguments
        args = self.reqparser.parse_args()
        subtheme = None
        # does the theme exist?
        if "id" in args:
            subtheme = SubTheme.get_by(id=args["id"])
        elif "name" in args and "theme_id" in args:
            subtheme = SubTheme.get_by(name=args["name"], t_id=args["theme_id"])

        if not subtheme:
            if not ("name" in args and "theme_id" in args):
                return ({"error": "Argument dependency error: deletion by name requires theme_id"},
                        HTTPStatus.BAD_REQUEST)

            # cannot delete a theme that does not exist.
            return {'error': 'Sub-theme does not exists.'}, HTTPStatus.NOT_FOUND

        # delete the theme
        subtheme.delete()
        subtheme.commit()

        return "", HTTPStatus.NO_CONTENT
