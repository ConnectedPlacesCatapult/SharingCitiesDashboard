from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource
from flask_restful import reqparse

from models.unit import Unit


class GetAllUnitsOfMeasure(Resource):
    """
    Endpoint used to fetch units from the database table 'unit'
    Parameters can be passed using a POST request that contains a JSON with the following fields:
                :param limit: the maximum number of entries to return
                :type symbol: int
    """
    def __init__(self) -> None:
        """
        Instantiates the endpoint to get a unit from the database table unit.
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('limit', required=False, default=100, type=int, location=['form', 'json'])

    @jwt_required
    def post(self) -> ([Unit], HTTPStatus):
        """
        Fetches all unit entries
        Parameters can be passed using a POST request that contains a JSON with the following fields:
                :param limit: the maximum number of entries to return

        :return: a list Unit and an HTTPStatus code of 200 on succcess otherwise a liost with a single item and a
                http status code 404 is returned
        """
        if not get_jwt_claims()['admin']:
            return {"message": "Not Authorized."}, HTTPStatus.UNAUTHORIZED

        # Get arguments passed in POST request
        args = self.reqparser.parse_args()
        units = []
        [units.append(unit.json()) for unit in Unit.get_with_limit(args["limit"])]

        if len(units) < 1:
            return [].append("No units found"), HTTPStatus.NOT_FOUND

        return units, HTTPStatus.OK
