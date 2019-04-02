import logging
from http import HTTPStatus

from flask_restful import Resource
from flask_restful import reqparse

from models.pin_location_data import LocationData

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DeleteLocationData(Resource):
    """
    Delete Location Data by Id
    """

    def __init__(self) -> None:
        """
        Set required arguments for POST request
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('id', required=True,
                                    help="LocationData id required", type=int)

    def post(self) -> (str, HTTPStatus):
        """
        Delete Location Data by Id
        :param id: LocationData Id
        :return: No Content in body and an HTTPStatus 204 (No Content) on
                success, otherwise an Json error message with an HTTPStatus
                code 404 (Not Found)
        """
        args = self.reqparser.parse_args()
        loc_data = LocationData.get_by_id(args["id"])
        if loc_data:
            loc_data.delete()
            loc_data.commit()
            return "", HTTPStatus.NO_CONTENT

        return dict(error="Location Data id not found",
                    id=str(args["id"])), HTTPStatus.NOT_FOUND
