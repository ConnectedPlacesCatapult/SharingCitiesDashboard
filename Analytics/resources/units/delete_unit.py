from http import HTTPStatus

from flask_jwt_extended import get_jwt_claims
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import reqparse

from models.unit import Unit


class DeleteUnit(Resource):
    """
    Deletes a unit of measure in the unit database table by the _type value
    for example symbol = 'kg'. if the the symbol='kg' exists in the table it will be deleted
    Parameters can be passed using a POST request that contains a JSON with the following fields:
            :param _type: units symbol eg kg for kilograms
            :type _type: string
    """

    def __init__(self) -> None:
        """
        Instantiates the endpoint to add new units to the database table unit.
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('_type', required=False, type=str, store_missing=False, location=['form', 'json'])
        self.reqparser.add_argument('id', required=False, type=str, store_missing=False, location=['form', 'json'])

    @jwt_required
    def post(self) -> ({str: str}, HTTPStatus):
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

        if "_type" not in args and "id" not in args:
            return {"error": "_type or id required"}, HTTPStatus.BAD_REQUEST

        unit = None
        if "id" in args:
            # get unit instance from db by id
            unit = Unit.get_by(id=args["id"])
        elif "_type" in args and unit is None:
            # get unit instance from db by id
            unit = Unit.get_by(_type=args["_type"])

        if not unit or len(unit) < 1:
            # Unit symbol not found
            return {"message": "Unit not found",
                    ("_type" if "_type" in args else "id"): (args["_type"] if "_type" in args else args["id"])
                    }, HTTPStatus.NOT_FOUND
        # delete unit from db
        unit = unit[0]
        unit.delete()
        unit.commit()

        return {"message": "Unit deleted",
                "_type": unit._type,
                "description": unit.description
                }, HTTPStatus.NO_CONTENT
