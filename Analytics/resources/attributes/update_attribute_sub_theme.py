import logging
from http import HTTPStatus

from flask_restful import Resource
from flask_restful import reqparse

from models.attribute_alias import AttrAlias
from models.attributes import Attributes
from models.theme import SubTheme

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class UpdateAttributeSubTheme(Resource):
    """
    Update Attribute Subtheme
    """

    def __init__(self):
        """
        Set reqpase arguments
        """
        self.reqpaser = reqparse.RequestParser()
        self.reqpaser.add_argument("attribute_id", type=str, required=True, help="attribute id required")
        self.reqpaser.add_argument("sub_theme_id", type=int, required=True, help="user id required")

    def post(self) -> ({str: str}, HTTPStatus):
        """
        Update Attributes SubTheme
        :param attribute_id: Attributes identification number
        :param sub_theme_id: SubTheme identification number
        :type attribute_id: str
        :type sub_theme_id: int
        :return: A JSON containing a message, Attribute id, SubTheme id and a HTTPStatus 200 (OK) on success
                otherwise a JSON with a error message and a HTTPStatus 404 (NotFound)
        """
        args = self.reqpaser.parse_args()

        attribute = AttrAlias.get_by_attr_id(args["attribute_id"])
        if not attribute:
            attribute = Attributes.get_by_id(args["attribute_id"])

        if not attribute:
            return {"error": "Attribute not found", "id": args["attribute_id"]}, HTTPStatus.NOT_FOUND

        sub_theme = SubTheme.get_by(id=args["sub_theme_id"])
        if not sub_theme:
            return {"error": "SubTheme not found", "id": args["sub_theme_id"]}, HTTPStatus.NOT_FOUND

        attribute.sub_theme_id(sub_theme.id)
        attribute.save()
        attribute.commit()

        return {"message": "Attribute SubTheme updated", "attribute_id": args["attribute_id"],
                "sub_theme_id": args["sub_theme_id"]}, HTTPStatus.OK
