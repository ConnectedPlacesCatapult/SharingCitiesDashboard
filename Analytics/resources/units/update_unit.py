from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource
from flask_restful import reqparse

from models.unit import Unit


class UpdateUnitOfMeasure(Resource):
    """
    Fetches a specified unit instance from the database by its symbol and updates the symbol and/or the description
    :post:
        :arg symbol:            Symbol string of the unit eg 'kg'
        :arg symbol:            The new symbol string of the unit eg 'kg'
        :arg new_description:   The new description of the unit
        :type symbol:           str
        :type new_symbol:       str
        :type new_description:  str

    :return: on success a JSON of the unit and an HTTPStatus code is return otherwise
    """
    def __init__(self) -> None:
        """
        Instantiates the endpoint to update a unit in the database table unit.
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('symbol', required=True, type=str, location=['form', 'json'])
        self.reqparser.add_argument('new_symbol', required=False, type=str, location=['form', 'json'])
        self.reqparser.add_argument('new_description', required=False, type=str, location=['form', 'json'])

    @jwt_required
    def post(self) -> ({"message": str, "symbol": str, "description": str}, HTTPStatus):
        """
        Fetches a specified unit instance from the database by its symbol and updates the symbol and/or the description
        :post:
        :arg symbol:            Symbol string of the unit eg 'kg'
        :arg symbol:            The new symbol string of the unit eg 'kg'
        :arg new_description:   The new description of the unit
        :type symbol:           str
        :type new_symbol:       str
        :type new_description:  str

        :return: on success a JSON of the unit and an HTTPStatus code is return otherwise
        """
        if not get_jwt_claims()['admin']:
            return {"message": "Not Authorized."}, HTTPStatus.UNAUTHORIZED

        # Get arguments passed in POST request
        args = self.reqparser.parse_args()

        # try fetch the unit from the database
        unit = Unit.get_by_symbol(args["symbol"])

        # was the unit found?
        if not unit:
            # the unit with the symbol or description was not found
            return {"message": "Unit not found.",
                    "symbol": args["symbol"] if "symbol" in args else "-",
                    "description": args["description"] if "description" in args else "-"
                    }, HTTPStatus.NOT_FOUND

        if "new_description" in args:
            unit.description = args["new_description"]

        if "new_symbol" in args:
            unit.symbol = args["new_symbol"]

        unit.save()
        unit.commit()

        return unit.json(), HTTPStatus.OK
