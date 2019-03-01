from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource
from flask_restful import reqparse

from models.theme import Theme


class RenameTheme(Resource):
    """
    Rename an existing Theme
    """
    def __init__(self) -> None:
        """
        Set required arguments for POST request
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('current_name', required=True, type=str, help='Current theme name required',
                                    location=['form', 'json'])
        self.reqparser.add_argument('new_name', required=True, type=str, help='New theme name required',
                                    location=['form', 'json'])

    @jwt_required
    def post(self) -> ({str: str}, HTTPStatus):
        """
        Rename an existing Theme
        :post_argument  current_name: name of SubTheme
        :post_argument new_name: new name of SubTheme
        :post_type  current_name: str
        :post_type  new_name: str
        :returns: A JSON of the changes made to the theme with a http status code of 200, otherwise
                  a JSON of the error details and the appropriate http status code
        """
        if not get_jwt_claims()['admin']:
            return {"error": "administration privileges required"}, HTTPStatus.FORBIDDEN

        # Get arguments
        args = self.reqparser.parse_args()

        # Check the current theme name and the new theme name  is not empty, abort if it is empty
        if args["current_name"] == "" or args["new_name"] == "":
            return ({
                        'error': 'Theme name cannot be empty',
                        'name': args["current_name"],
                        'new_name': args["new_name"]
                    }, HTTPStatus.BAD_REQUEST)

        theme = Theme.get_by_name(args["current_name"])

        if not theme:
            # cannot rename a theme that does not exist.
            return {'error': 'Theme does not exists.', 'id': " ", 'name': args["current_name"]}, HTTPStatus.BAD_REQUEST

        # Does the new name for theme exist?
        if Theme.get_by_name(args["new_name"]):
            return {'error': 'Cannot rename theme to {} ; Theme {} already exists.'.format(args["new_name"],
                                                                                           args["new_name"]),
                    'id': "", 'name': args["current_name"]}, HTTPStatus.BAD_REQUEST

        # rename the new theme
        theme.name = args["new_name"]
        theme.save()
        theme.commit()

        return ({
                    "message": "Theme renamed",
                    "id": theme.id,
                    "old_name": args["current_name"],
                    "new_name": theme.name
                }, HTTPStatus.OK)
