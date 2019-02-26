from http import HTTPStatus

from flask_jwt_extended import get_jwt_claims
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import reqparse

from models.unit import Unit


class DeleteUnitOfMeasurement(Resource):
    """
    Deletes a unit of measure in the unit database table by the _type value
    for example symbol = 'kg'. if the the symbol='kg' exists in the table it will be deleted
    Parameters can be passed using a POST request that contains a JSON with the following fields:
            :param symbol: units symbol eg kg for kilograms
            :type symbol: string
    """
    def __init__(self) -> None:
        """
        Instantiates the endpoint to add new units to the database table unit.
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('symbol', required=True, type=str, help='A symbol for the unit is required',
                                    location=['form', 'json'])

    @jwt_required
    def post(self) -> ({"message": str, "symbol": str, "description": str}, HTTPStatus):
        """
        Deletes a unit of measure in the unit database table by the _type value
        for example symbol = 'kg'. if the the symbol='kg' exists in the table it will be deleted
        Parameters can be passed using a POST request that contains a JSON with the following fields:
                :param symbol: units symbol eg kg for kilograms
                :type symbol: string
        :return: A json response  containing a message, unit type and unit description with an http status code of 204
        """
        if not get_jwt_claims()['admin']:
            return {"message": "Not Authorized."}, HTTPStatus.UNAUTHORIZED

        args = self.reqparser.parse_args()
        # get unit instance from db by symbol
        unit = Unit.get_by_symbol(args["symbol"])

        if not unit:
            # Unit symbol not found
            return {"message": "Unit not found",
                    "symbol": args["symbol"]
                    }, HTTPStatus.NOT_FOUND
        # delete unit from db
        unit.delete()
        unit.commit()

        return {"message": "Unit deleted",
                "symbol": unit.symbol,
                "description": unit.description
                }, HTTPStatus.NO_CONTENT
