from http import HTTPStatus
from typing import Any

from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import reqparse

from db import db
from models.attribute_alias import AttrAlias
from models.attributes import Attributes
from models.theme import Theme, SubTheme
from models.unit import Unit


class GETThemeTree(Resource):
    """
    Fetch Theme Tree Themes
    """

    def __init__(self) -> None:
        """
        Set required arguments for POST request
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('theme_id', required=False, store_missing=False, type=int)

    @jwt_required
    def get(self) -> ({str: Any}, HTTPStatus):
        """
        Fetch Theme Tree
        :return: A Theme Tree JSON and an HTTP status code 200 (Ok) on success, otherwise an error message and the
                 appropriate HTTP status code
        """
        args = self.reqparser.parse_args()

        # Fetch single Theme's Tree
        if "theme_id" in args:
            theme = Theme.get_by_id(args["theme_id"])
            if not theme:
                return {"error": "Theme not found", "theme_id": args["theme_id"]}, HTTPStatus.NOT_FOUND
            self.create_theme_tree(theme)
        # Fetch All Themes Trees
        else:
            themes = self.fetch_all_themes()

    def print_branch(self, branch):
        print("==>>>\t{}".format(branch.__name__))
        for item in branch:
            if isinstance(item, dict):
                for k, v in item.items():
                    print("\t\t{}: {}".format(k, v))
            if isinstance(item, list):
                for i in item:
                    print("\t\t{}".format(i))
            print(item)

    def create_theme_tree(self, theme: db.Model) -> ({str: {str: Any}}, HTTPStatus):
        theme_root = theme.json()
        subthemes = self.fetch_sub_themes(theme.id)

        attributes = self.get_attributes_for_sub_themes(subthemes)

    def get_attributes_for_sub_themes(self, subthemes: [SubTheme]):
        attributes = [attr.json() for attr in self.get_attributes_for_sub_themes(sub for sub in subthemes)]
        aliases = [alias.json() for alias in self.fetch_Alias()]

        self.print_branch(attributes)

    def fetch_all_themes(self):
        """Fetch all Themes"""
        return Theme.get_all()

    def fetch_sub_themes(self, theme_id: int) -> [db.Model]:
        """ Fetch SubThemes related to theme_id"""
        return SubTheme.get_by_theme_id(theme_id)

    def fetch_attributes(self, subtheme_id: int) -> [db.Model]:
        """ Fetch Attributes by SubThe Id"""
        return Attributes.get_by_sub_theme_id(subtheme_id)

    def fetch_Alias(self, attr_id: int) -> [db.Model]:
        """ Fetch Attributes by SubThe Id"""
        return AttrAlias.get_by_attr_id(attr_id)

    def fetch_unit(self, unit_id: int) -> db.Model:
        """Fetch Unit by Id"""
        return Unit.get_by_id(unit_id)
