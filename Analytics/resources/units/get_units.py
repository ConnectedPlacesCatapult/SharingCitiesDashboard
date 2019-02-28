from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource
from flask_restful import reqparse

from models.unit import Unit


class GetUnits(Resource):
    """
    Endpoint used to fetch units from the database table 'unit'
    Parameters can be passed using a POST request that contains a JSON with the following fields:
    :param limit: the maximum number of entries to return
    :param _type: the unit type
    :param id: the unit identification number
    :type limit: int
    :type _type: str
    :type id: str
    """

    def __init__(self) -> None:
        """
        Instantiates the endpoint to get a unit from the database table unit.
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('limit', required=False, store_missing=False, type=int, location=['form', 'json'])
        self.reqparser.add_argument('_type', required=False, store_missing=False, type=str, location=['form', 'json'])
        self.reqparser.add_argument('id', required=False, store_missing=False, type=str, location=['form', 'json'])

    @jwt_required
    def post(self) -> ([Unit], HTTPStatus):
        """
        Fetches all unit entries
        Parameters can be passed using a POST request that contains a JSON with the following fields:
        :param limit: the maximum number of entries to return
        :param _type: the unit type
        :param id: the unit identification number
        :type limit: int
        :type _type: str
        :type id: str

        :return: a list of Unit/s and an HTTPStatus code of 200 on succcess otherwise a list with a single item
         and a http status code 404 is returned
        """
        # is the user an admin user?
        if not get_jwt_claims()['admin']:
            return {"message": "Not Authorized."}, HTTPStatus.UNAUTHORIZED

        # Get arguments passed in POST request
        args = self.reqparser.parse_args()

        # fetch units using arguments passed in post request
        units = []
        if "_type" in args:
            [units.append(unit.json()) for unit in Unit.get_by(_type=args["_type"])]
        elif "id" in args:
            [units.append(unit.json()) for unit in Unit.get_by(id=args["id"])]
        else:
            [units.append(unit.json()) for unit in Unit.get()]

        # were any units found in the database?
        if len(units) < 1:
            # no units were found
            return [].append("No units found"), HTTPStatus.NOT_FOUND
        # units were found
        return units, HTTPStatus.OK
