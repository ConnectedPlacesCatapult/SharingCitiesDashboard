import logging
from http import HTTPStatus

from flask_restful import Resource
from flask_restful import reqparse

from db import db
from models.attributes import Attributes

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class GetAttributes(Resource):
    """Get Attributes from database"""

    def __init__(self) -> None:
        """
        Set reqpase arguments
        """
        self.reqpaser = reqparse.RequestParser()
        self.reqpaser.add_argument("attribute_id", type=str, store_missing=False, required=False)
        self.reqpaser.add_argument("subtheme_id", type=int, store_missing=False, required=False)

    def get(self) -> [db.Model]:
        """
        Fetch Attributes from the database
        :param attribute_id:    Attribute id
        :param subtheme_id:    SubTheme id
        :return:   A list of Attributes with an HTTPstatus code OK (200) or an error message and a the appropriate
                    HTTPStatus code
        """
        args = self.reqpaser.parse_args()

        # Fetch by attribute_id
        if "attribute_id" in args and "subtheme_id" not in args:
            attribute = Attributes.get_by_id(args["attribute_id"])
            if not attribute:
                return {"error": "Attribute not found", "id": args["attribute_id"]}, HTTPStatus.NOT_FOUND
            content = [attribute]
            return [attr.json() for attr in content], HTTPStatus.OK

        # Fetch by subtheme_id
        elif "attribute_id" not in args and "subtheme_id" in args:
            attributes = Attributes.get_by_sub_theme_id(args["subtheme_id"])
            if not attributes:
                return {"error": "Attributes not found", "subtheme_id": args["subtheme_id"]}, HTTPStatus.NOT_FOUND
            if isinstance(attributes, Attributes):
                content = [attributes]
                return [attr.json() for attr in content], HTTPStatus.OK
            return [attr.json() for attr in attributes], HTTPStatus.OK

        # Fetch all attribute
        attributes = Attributes.get_all()
        return [attr.json() for attr in attributes], HTTPStatus.OK
