from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource
from flask_restful import reqparse

from models.theme import Theme


class AddTheme(Resource):
    """
    Creates a new Theme entry in the database
    """

    def __init__(self) -> None:
        """
        Creates a new Theme entry in the database
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('name', required=True, type=str, help='Theme name required',
                                    location=['form', 'json'])

    @jwt_required
    def post(self) -> ({str: str}, HTTPStatus):
        """
        Creates a new theme
        :post_argument  name: the name of the new theme
        :post_type  name: str
        """
        if not get_jwt_claims()['admin']:
            return {"error": "administration privileges required"}, HTTPStatus.FORBIDDEN

        # Get arguments
        args = self.reqparser.parse_args()

        # Check the theme name is not empty, abort if it is empty
        if args["name"] == "":
            return {'error': 'Theme cannot be empty', 'name': "''"}, HTTPStatus.BAD_REQUEST

        # Check theme does not exist (avoid duplicates)
        if Theme.get_by_name(args["name"]):
            return {'message': 'Theme already exists.', 'id': " ", 'name': args["name"]}, HTTPStatus.BAD_REQUEST

        # Create the new theme
        theme = Theme(args["name"])
        theme.save()
        theme.commit()

        return {"message": "New theme created", "id": theme.id, "name": theme.name}, HTTPStatus.OK
