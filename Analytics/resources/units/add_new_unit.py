from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource
from flask_restful import reqparse

from models.unit import Unit


class AddUnitOfMeasurement(Resource):
    """
    Creates a new unit of measure in the unit database table; with a symbol and a description
    for example symbol = 'kg'  description = 'Kilogram
    Parameters can be passed using a POST request that contains a JSON with the following fields:
        :param symbol: units symbol eg kg for kilograms
        :param description: a description of the measurement unit eg.. kilograms
        :type symbol: string
        :type description: string
    """

    def __init__(self) -> None:
        """
        Instantiates the endpoint to add new units to the database table unit.

        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('symbol', required=True, type=str, help='Unit must have a type',
                                    location=['form', 'json'])
        self.reqparser.add_argument('description', required=True, type=str, help='Unit must have a discription',
                                    location=['form', 'json'])

    @jwt_required
    def post(self) -> ({"message": str, "symbol": str, "description": str}, HTTPStatus):
        """
        Creates a new unit of measure in the unit database table; with a symbol and a description
        for example symbol = 'kg'  description = 'Kilogram
        Parameters can be passed using a POST request that contains a JSON with the following fields:
            :param symbol: units symbol eg kg for kilograms
            :param description: a description of the measurement unit eg.. kilograms
            :type symbol: string
            :type description: string

        :return: A json response  containing a message, unit type and unit description with an http status code of 200
                 otherwise a JSON with the error discription and the appropriate HTTPStatus code
        """
        if not get_jwt_claims()['admin']:
            return {"message": "Not Authorized."}, HTTPStatus.UNAUTHORIZED

        args = self.reqparser.parse_args()
        # does the measurement unit already exist?
        if Unit.get_by_symbol(args["symbol"]):
            # measurement unit already exists
            return {"message": "Unit already exists.",
                    "symbol": args["symbol"],
                    "description": args["description"]
                    }, HTTPStatus.BAD_REQUEST
        # Create new measurement unit
        new_unit = Unit(args["symbol"], args["description"])
        new_unit.save()
        new_unit.commit()

        return {"message": "New unit created",
                "symbol": args["symbol"],
                "description": args["description"]
                }, HTTPStatus.OK
