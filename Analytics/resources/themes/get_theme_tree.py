from http import HTTPStatus

from flask_restful import Resource
from flask_restful import reqparse

from db import db
from models.attribute_alias import AttrAlias
from models.attributes import Attributes
from models.theme import Theme, SubTheme
from models.users import Users


class GetThemeTree(Resource):
    """
    Fetch Theme Tree Themes
    """

    def __init__(self) -> None:
        """
        Set required arguments for POST request
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('user_id', required=False, default=-1, type=int)
        self.reqparser.add_argument('theme_id', required=False, store_missing=False, type=int)

        self.error_response = {}
        self.response = []

    def get(self) -> (dict, HTTPStatus):
        """
        Fetch Theme Tree
        :return: A Theme Tree JSON and an HTTP status code 200 (Ok) on success, otherwise an error message and the
                 appropriate HTTP status code
        """
        args = self.reqparser.parse_args()
        # Create JSON Error response if dB dependencies are not found (Theme and/or User)
        self.args_db_checker(args)

        if "theme_id" in args:
            # Fetch Theme Tree by theme_id
            self.create_theme_tree(args["theme_id"], args["user_id"])
        elif "user_id" in args:
            # Fetch All Theme Trees and Aliases
            self.get_all_themes(args["user_id"])
        else:
            # Fetch All Theme Tree but no Attribute Aliases
            self.get_all_themes()

        return self.response, 200

    def args_db_checker(self, args) -> None:
        """
        Check parsed Arguments and dependencies and Create appropriate RFC-7807 JSON Error Response
        :param args: Parsed Arguments in GET request
        """
        invalid_params = []
        if "user_id" in args:
            # Create JSON Error message if User does not exist
            if not Users.find_by_id(args["user_id"]) and args["user_id"] >= 0:
                invalid_params.append(
                    {"name": "user_id", "value": args["user_id"], "reason": "User Not Found", "code": 404,
                     "rollback": "Theme Tree will not contain  Attribute Aliases"})

        if "theme_id" in args:
            # Create JSON Error message if Theme does not exist
            if not Theme.get_by_id(args["theme_id"]):
                invalid_params.append({"name": "theme_id", "value": args["theme_id"], "reason": "Theme Not Found",
                                       "code": 404, "rollback": "A Themes will be return in the Theme Tree"})

        if invalid_params:
            # Put Error message in response
            self.response = [{"error": dict(type='Request entries not found',
                                            title="Unable to fetch dB entries for parsed arguments",
                                            invalid_params=invalid_params)}]

    def get_all_themes(self, user_id: int = None) -> None:
        """
        Create Theme Tree containing all Themes, SubThemes, Attributes and Attribute Aliases if user_id exists
        :param user_id: User Id for Attribute Aliases
        """
        theme_ids = {theme.id for theme in Theme.get_all()}
        self.response.extend([resp for resp in [self.create_theme_tree(theme_id, user_id) for theme_id in theme_ids]
                              if resp])

    def create_theme_tree(self, theme_id: int, user_id: int):
        """
        Create Theme Tree
        :param theme_id: Theme Id
        :param user_id: User Id
        """
        theme = Theme.get_by_id(theme_id)
        if not theme:
            # Theme does not exist
            self.get_all_themes(user_id)
            return
        # Create Theme Trunk
        theme_tree = theme.serializable

        sub_themes = SubTheme.get_by_theme_id(theme_id)
        if not sub_themes:
            # No SubThemes in Theme return Trunk
            return theme_tree

        sub_theme_ids = {sub.id for sub in sub_themes}

        sub_list = []
        for sub in sub_themes:
            sub_list.append(sub.serializable)

        attribute_by_sub_id = self.get_attributes(user_id, sub_theme_ids, theme_id)

        for sub in sub_list:
            # Add Attribute branches
            attr = attribute_by_sub_id.get(sub["id"])
            if attr:
                sub["attributes"] = attr
        # Add SubTheme branches
        theme_tree["sub_themes"] = sub_list

        self.response.append(theme_tree)

    @staticmethod
    def get_attributes(user_id: int, sub_theme_ids: [int], theme_id: int) -> [Attributes]:
        """
        Fetch Attributes by User Id and SubTheme Ids
        :param user_id: The Users Id number
        :param sub_theme_ids: A set of Subtheme id numbers
        :param theme_id: Current Theme Id
        :return: Attributes that match the User id and Subtheme ids
        """
        # Fetch attributes
        attributes = db.session.query(Attributes).filter(Attributes.sub_theme_id.in_(sub_theme_ids)).options(
            db.joinedload(Attributes.sub_theme)).all()
        attribute_by_sub_id = dict()

        for attribute in attributes:
            # Create Attribute Braches and Attribute alias Branches
            if attribute.sub_theme_id not in attribute_by_sub_id:
                attribute_by_sub_id[attribute.sub_theme_id] = list()
            attr_serial = attribute.serializable

            attr_serial["theme_id"] = theme_id

            alias = AttrAlias.get_by(user_id=user_id, attribute_id=attribute.id)
            if alias:
                attr_serial["alias"] = alias.serializable
            attribute_by_sub_id[attribute.sub_theme_id].append(attr_serial)

        return attribute_by_sub_id
