from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource
from flask_restful import reqparse

from models.unit import Unit


class UpdateUnit(Resource):
    """
    Fetches a specified unit instance from the database by its symbol and updates the symbol and/or the description
    :post:
        :arg _type:            type of unit eg 'kg'
        :arg id:               id of the unit
        :arg new_type:         The new symbol string of the unit eg 'kg'
        :arg new_description:  The new description of the unit
        :type _type:           str
        :type new_typel:       str
        :type new_description: str

    :return: on success a JSON of the unit and an HTTPStatus code is return otherwise
    """

    def __init__(self) -> None:
        """
        Instantiates the endpoint to update a unit in the database table unit.
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('id', required=False, store_missing=False, type=str, location=['form', 'json'])
        self.reqparser.add_argument('_type', required=False, store_missing=False, type=str, location=['form', 'json'])
        self.reqparser.add_argument('new_type', required=False, store_missing=False, type=str,
                                    location=['form', 'json'])
        self.reqparser.add_argument('new_description', required=False, store_missing=False, type=str,
                                    location=['form', 'json'])

    @jwt_required
    def post(self) -> ({str: str}, HTTPStatus):
        """
        Fetches a specified unit instance from the database by its symbol and updates the symbol and/or the description
        :post:
        :arg _type:            Symbol string of the unit eg 'kg'
        :arg new_type:            The new symbol string of the unit eg 'kg'
        :arg new_description:   The new description of the unit
        :type _type:           str
        :type new_typel:       str
        :type new_description:  str

        :return: on success a JSON of the unit and an HTTPStatus code is return otherwise
        """
        if not get_jwt_claims()['admin']:
            return {"message": "Not Authorized."}, HTTPStatus.UNAUTHORIZED

        # Get arguments passed in POST request
        args = self.reqparser.parse_args()

        if "new_type" not in args and "new_description" not in args:
            return {"error": "No new type or description parsed."}, HTTPStatus.BAD_REQUEST

        if "id" not in args and "_type" not in args:
            return {"error": "No _type or id parsed."}, HTTPStatus.BAD_REQUEST

        # try fetch the unit from the database
        unit = next(iter(Unit.get_by(id=args["id"]) if "id" in args else Unit.get_by(_type=args["_type"])), None)

        # was the unit found?
        if not unit:
            # the unit with the symbol or description was not found
            return {"message": "Unit not found.",
                    "_type": args["_type"] if "_type" in args else "-",
                    "description": args["description"] if "description" in args else "-"
                    }, HTTPStatus.NOT_FOUND

        if "new_description" in args:
            unit.description = args["new_description"]

        if "new_type" in args:
            unit._type = args["new_type"]

        unit.save()
        unit.commit()
        return unit.json(), HTTPStatus.OK
