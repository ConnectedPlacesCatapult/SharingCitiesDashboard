from http import HTTPStatus

from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import reqparse

from models.theme import Theme, SubTheme


class AddSubTheme(Resource):
    """
    Creates a new sub theme
    """
    def __init__(self) -> None:
        """
        adds a sub theme from the database
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('theme', required=False, store_missing=False, default=None, type=str,
                                    help='Theme required', location=['form', 'json'])
        self.reqparser.add_argument('theme_id', required=False, store_missing=False, default=None, type=str,
                                    help='Theme required', location=['form', 'json'])
        self.reqparser.add_argument('subtheme', required=True, type=str, help='Sub theme name required',
                                    location=['form', 'json'])

    @jwt_required
    def post(self) -> ({str: str}, HTTPStatus):
        """
        Adds a new sub theme to the database
        :post_argument  theme: the name of the parent theme
        :post_argument theme_id: the the identification number of the parent theme
        :post_argument  subtheme: the name of the sub theme
        :post_type  theme: str
        :post_type  theme_id: int
        :post_type  subtheme: str
        :returns: A JSON of the new subtheme with a http status code of 200, otherwise a JSON of the error details
                  and the appropriate http status code
        """
        args = self.reqparser.parse_args()

        # remove arguments that are empty string arguments
        args = {k: v for k, v in args.items() if len(v) > 0}

        if "theme" not in args and "theme_id" not in args:
            return {"error": "theme or theme_id required"}, HTTPStatus.BAD_REQUEST

        theme = None
        if "theme_id" in args:
            theme = Theme.get_by_id(args["theme_id"])

        elif "theme" in args:
            theme = Theme.get_by_theme(args["theme"])

        if not theme:
            return ({"error": "Theme not found", "Theme": args["theme_id"] if args["theme_id"] else args["theme"]},
                    HTTPStatus.NOT_FOUND)

        sub_theme = SubTheme.get_by(name=args["subtheme"], t_id=theme.id)

        # Avoid duplicating sub themes
        if sub_theme:
            return {
                       "error": "sub theme already exists",
                       "theme_id": theme.id,
                       "sub_theme_id": sub_theme.id,
                       "Theme": theme.name,
                       "subtheme": sub_theme.name
                   }, HTTPStatus.BAD_REQUEST

        sub_theme = SubTheme(theme.id, args["subtheme"])
        sub_theme.save()
        sub_theme.commit()
        return {
                   "message": "sub theme created",
                   "theme_id": theme.id,
                   "sub_theme_id": sub_theme.id,
                   "Theme": theme.name,
                   "subtheme": sub_theme.name
               }, HTTPStatus.OK
