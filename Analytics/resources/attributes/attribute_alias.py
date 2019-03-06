import logging
from http import HTTPStatus

from flask_restful import Resource
from flask_restful import reqparse

from models.attribute_alias import AttrAlias
from models.attributes import Attributes
from models.users import Users

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class AttributeAlias(Resource):
    """
    Create, Update or Fetch Attribute Alias
    """

    def __init__(self):
        """
        Set reqpase arguments
        """
        self.reqpaser = reqparse.RequestParser()
        self.reqpaser.add_argument("attribute_id", type=str, required=True, help="attribute id required")
        self.reqpaser.add_argument("user_id", type=int, required=True, help="user id required")
        self.reqpaser.add_argument("name", type=str, required=False, store_missing=False, default=None,
                                   help="attribute id required")
        self.reqpaser.add_argument("table_name", type=str, required=False, store_missing=False, default=None,
                                   help="user id required")
        self.reqpaser.add_argument("unit_id", type=int, required=False, store_missing=False, default=None,
                                   help="attribute id required")
        self.reqpaser.add_argument("description", type=str, required=False, store_missing=False, default=None,
                                   help="attribute id required")

    def post(self) -> ({str: str}, HTTPStatus):
        """
        Update AttrAlias (Attribute Alias) if it exists otherwise create an AttrAlias
        :param attribute_id:    Parent Attribute id to alias
        :param user_id:    Owner user id
        :param name:    Alias for Attribute name
        :param table_name:  Alias for Attribute table_name
        :param unit_id: Id of unit to be used
        :param description: Custom user description for Attribute
        :return:   AttrAlias with an HTTPstatus code OK (200) or an error message and a the appropriate HTTPStatus code
        """
        args = self.reqpaser.parse_args()

        attribute = Attributes.get_by_id(args["attribute_id"])
        if not attribute:
            return {"error": "Attribute Not Found."}, HTTPStatus.NOT_FOUND

        user = Users.find_by_id(args["user_id"])
        if not user:
            return {"error": "User Not Found."}, HTTPStatus.NOT_FOUND

        alias = AttrAlias.get_by(user_id=args["user_id"], attribute_id=args["attribute_id"])
        if alias:
            alias.name = args["name"] if "name" in args else alias.name
            alias.table_name = args["table_name"] if "table_name" in args else alias.table_name
            alias.unit_id = args["unit_id"] if "unit_id" in args else alias.unit_id
            alias.description = args["description"] if "description" in args else alias.description
        else:
            alias = AttrAlias(args["attribute_id"], args["user_id"],
                              name=args.get("name"),
                              table_name=args.get("table_name"),
                              description=args.get("description"))
        try:
            alias.save()
            alias.commit()
        except Exception as e:
            logger.error("failed to persist attribute alias", e)
            return {"error": "Failed to commit attribute alias to database",
                    "exception": e}, HTTPStatus.INTERNAL_SERVER_ERROR

        return alias.json(), HTTPStatus.OK

    def get(self) -> ({str: str}, HTTPStatus):
        """
        Fetch AttrAlias (Attribute Alias) from the database
        :param attribute_id:    Parent Attribute id
        :param user_id:    Owner user id
        :return:   AttrAlias with an HTTPstatus code OK (200) or an error message and a the appropriate HTTPStatus code
        """
        args = self.reqpaser.parse_args()

        attribute = Attributes.get_by_id(args["attribute_id"])
        if not attribute:
            return {"error": "Attribute Not Found."}, HTTPStatus.NOT_FOUND

        user = Users.find_by_id(args["user_id"])
        if not user:
            return {"error": "User Not Found."}, HTTPStatus.NOT_FOUND

        alias = AttrAlias.get_by(user_id=args["user_id"], attribute_id=args["attribute_id"])
        if not alias:
            attribute

        return alias.json(), HTTPStatus.OK
