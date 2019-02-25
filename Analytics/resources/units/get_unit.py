from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource
from flask_restful import reqparse

from models.unit import Unit


class GetUnitOfMeasure(Resource):
    """
    Fetches a specified unit instance from the database by its symbol or description
        :post:
        :arg symbol:        Symbol string of the unit eg 'kg'
        :arg description:   The description of the unit
        :type symbol:       str
        :type description:  str
    """
    def __init__(self) -> None:
        """
        Instantiates the endpoint to get a unit from the database table unit.
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('symbol', required=False, type=str, location=['form', 'json'])
        self.reqparser.add_argument('description', required=False, type=str, location=['form', 'json'])

    @jwt_required
    def post(self) -> ({"message": str, "symbol": str, "description": str}, HTTPStatus):
        """
        Fetches a specified unit instance from the database by its symbol or description
        :post:
        :arg symbol:        Symbol string of the unit eg 'kg'
        :arg description:   The description of the unit
        :type symbol:       str
        :type description:  str

        :return: on success a JSON of the unit and an HTTPStatus code 200 is return otherwise a JSON decription of the
        error and the appropriate HTTPStatus code
        """
        if not get_jwt_claims()['admin']:
            return {"message": "Not Authorized."}, HTTPStatus.UNAUTHORIZED

        # Get arguments passed in POST request
        args = self.reqparser.parse_args()
        # is symbol or discription present?
        if args["symbol"] is None and args["description"] is None:
            # no symbol or description of the unit to find is present.
            return {"message": "symbol or description is required.",
                    "symbol": "not supplied",
                    "description": "not supplied"
                    }, HTTPStatus.BAD_REQUEST
        # try fetch the unit from the database
        unit = Unit.get_by_symbol(args["symbol"]) if args["symbol"] is not None else Unit.get_by_description(
            args["description"])

        # was the unit found?
        if not unit:
            # the unit with the symbol or description was not found
            return {"message": "Unit not found.",
                    "symbol": args["symbol"] if "symbol" in args else "-",
                    "description": args["description"] if "description" in args else "-"
                    }, HTTPStatus.NOT_FOUND

        return unit.json(), HTTPStatus.OK
