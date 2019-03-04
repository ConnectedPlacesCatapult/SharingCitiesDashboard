from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource
from flask_restful import reqparse

from models.theme import SubTheme


class RenameSubTheme(Resource):
    """
    Rename an existing SubTheme
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
        Rename an existing SubTheme
        :param current_name: the name of the sub theme to rename
        :param new_name: the new name for the sub theme
        :type  current_name: str
        :type  new_name: str
        :returns: A JSON of the changes made to the sub theme with a http status code of 200, otherwise
                  a JSON of the error details and the appropriate http status code
        """
        if not get_jwt_claims()['admin']:
            return {"error": "administration privileges required"}, HTTPStatus.FORBIDDEN

        # Get arguments
        args = self.reqparser.parse_args()

        # Check the current theme name and the new theme name  is not empty, abort if it is empty
        if args["current_name"] == "" or args["new_name"] == "":
            return ({
                        'error': 'Sub-theme name cannot be empty',
                        'name': args["current_name"],
                        'new_name': args["new_name"]
                    }, HTTPStatus.BAD_REQUEST)

        subtheme = SubTheme.get_by_name(args["current_name"])

        if not subtheme:
            # cannot rename a subtheme that does not exist.
            return {'error': 'Sub-theme does not exists.', 'id': " ",
                    'name': args["current_name"]}, HTTPStatus.BAD_REQUEST

        # Does the new name for theme exist?
        if SubTheme.get_by_name(args["new_name"]):
            return {'error': 'Cannot rename sub-theme to {} ; Sub-theme {} already exists.'.format(args["new_name"],
                                                                                                   args["new_name"]),
                    'id': "", 'name': args["current_name"]}, HTTPStatus.BAD_REQUEST

        # rename the new theme
        subtheme.name = args["new_name"]
        subtheme.save()
        subtheme.commit()

        return ({
                    "message": "Subtheme renamed",
                    "id": subtheme.id,
                    "old_name": args["current_name"],
                    "new_name": subtheme.name
                }, HTTPStatus.OK)
