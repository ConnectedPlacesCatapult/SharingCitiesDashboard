from http import HTTPStatus
from typing import Any

from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import reqparse

from db import db
from models.attribute_alias import AttrAlias
from models.attributes import Attributes
from models.theme import Theme, SubTheme


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

    @jwt_required
    def get(self) -> ({str: Any}, HTTPStatus):
        """
        Fetch Theme Tree
        :return: A Theme Tree JSON and an HTTP status code 200 (Ok) on success, otherwise an error message and the
                 appropriate HTTP status code
        """
        args = self.reqparser.parse_args()
        if "theme_id" in args:
            # Fetch Theme Tree by theme_id
            response = self.create_theme_tree(args["theme_id"], args["user_id"])
        else:
            # Fetch All Theme Trees
            theme_ids = {theme.id for theme in Theme.get_all()}
            response = [resp for resp in [self.create_theme_tree(theme_id, args["user_id"]) for theme_id in theme_ids]]

        return response, 200

    def create_theme_tree(self, theme_id: int, user_id: int) -> {str: Any}:
        """
        Create Theme Tree
        :param theme_id: Theme Id
        :param user_id: User Id
        :return: Theme Tree containing SubTheme, Attributes and Attribute Aliases if a User Id is parsed
        """

        theme = Theme.get_by_id(theme_id)
        if not theme:
            return {}

        theme_tree = theme.serializable

        sub_themes = SubTheme.get_by_theme_id(theme_id)
        if not sub_themes:
            return theme_tree

        sub_theme_ids = {sub.id for sub in sub_themes}

        sub_list = []
        for sub in sub_themes:
            sub_list.append(sub.serializable)

        attribute_by_sub_id = self.get_attributes(user_id, sub_theme_ids)

        for sub in sub_list:
            attr = attribute_by_sub_id.get(sub["id"])
            if attr:
                sub["attributes"] = attr

        theme_tree["sub_themes"] = sub_list

        return theme_tree

    @staticmethod
    def get_attributes(user_id: int, sub_theme_ids: [int]) -> [Attributes]:
        """
        Fetch Attributes by User Id and SubTheme Ids
        :param user_id: The Users Id number
        :param sub_theme_ids: A set of Subtheme id numbers
        :return: Attributes that match the User id and Subtheme ids
        """
        # Fetch attributes
        attributes = db.session.query(Attributes).filter(Attributes.sub_theme_id.in_(sub_theme_ids)).options(
            db.joinedload(Attributes.sub_theme)).all()
        attribute_by_sub_id = dict()

        for attribute in attributes:

            if attribute.sub_theme_id not in attribute_by_sub_id:
                attribute_by_sub_id[attribute.sub_theme_id] = list()
            attr_serial = attribute.serializable
            alias = AttrAlias.get_by(user_id=user_id, attribute_id=attribute.id)
            if alias:
                attr_serial["alias"] = alias.serializable
            attribute_by_sub_id[attribute.sub_theme_id].append(attr_serial)

        return attribute_by_sub_id
