import logging
from http import HTTPStatus

from flask_restful import Resource
from flask_restful import reqparse

from models.attribute_alias import AttrAlias

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class DeleteAttributeAlias(Resource):
    """Delete Attribute Alias"""

    def __init__(self) -> None:
        """
        Set reqpase arguments
        """
        self.reqpaser = reqparse.RequestParser()
        self.reqpaser.add_argument('id', type=int, required=False, store_missing=False)
        self.reqpaser.add_argument("attribute_id", type=str, required=False, store_missing=False)
        self.reqpaser.add_argument("user_id", type=int, required=False, store_missing=False)

    def post(self) -> ({str: str}, HTTPStatus):
        """
        Delete Attribute Alias
        :param id:  Attribute Alias id
        :param attribute_id:    Parent Attribute id
        :param user_id:     Current User id
        :return: No content with an HTTPstatus code NoContent (204) or an error message and a the appropriate
                HTTPStatus code
        """
        args = self.reqpaser.parse_args()
        alias = None
        if "id" in args:
            alias = AttrAlias.get_by(id=id)
            if not alias:
                return {"error": "Alias not found", "id": args["id"]}, HTTPStatus.NOT_FOUND

        elif "user_id" in args and "attribute_id" in args:
            alias = AttrAlias.get_by(user_id=args["user_id"], attribute_id=args["attribute_id"])
            if not alias:
                return {"error": "Alias not found", "attribute_id": args["attribute_id"],
                        "user_id": args["user_id"]}, HTTPStatus.NOT_FOUND

        if not isinstance(alias, AttrAlias):
            return {"error": "Alias not found", }, HTTPStatus.NOT_FOUND

        alias.delete()
        alias.commit()
        return None, HTTPStatus.NO_CONTENT
