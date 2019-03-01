from http import HTTPStatus

from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import reqparse

from models.theme import Theme


class GetThemes(Resource):
    """
    Fetch Themes
    """

    def __init__(self) -> None:
        """
        Set required arguments for POST request
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('limit', required=False, store_missing=False, type=int)
        self.reqparser.add_argument('name', required=False, store_missing=False, type=str)
        self.reqparser.add_argument('id', required=False, store_missing=False, type=str)

    @jwt_required
    def get(self) -> ([Theme], HTTPStatus):
        """
        Fetch Themes
        Parameters can be passed using a POST request that contains a JSON with the following fields:
        :param limit:   the maximum number of entries to return
        :param name:    themes name
        :param id:      the themes identification number
        :type limit:    int
        :type name:     str
        :type id:       str

        :return: a list of Theme/s and an HTTPStatus code of 200 on success otherwise an JSON with an error message
                 and appropriate http status
        """
        # Get arguments passed in POST request
        args = self.reqparser.parse_args()

        # fetch themes using arguments passed in post request
        themes = []
        if "id" in args:
            theme = Theme.get_by_id(args["id"])
            if theme:
                themes.append(theme.json())
        elif "name" in args:
            theme = Theme.get_by_name(args["name"])
            if theme:
                themes.append(theme.json())
        else:
            [themes.append(theme.json()) for theme in Theme.get_all()]

        # were any themes found in the database?
        if len(themes) < 1:
            # no themes were found
            return {"error": "No themes found"}, HTTPStatus.NOT_FOUND

        if "limit" in args:
            try:
                themes = themes[:int(args["limit"])]
            except ValueError:
                return {"error": "Limit parsed is not an int"}, HTTPStatus.BAD_REQUEST

        # themes were found
        return themes, HTTPStatus.OK
