import logging
from http import HTTPStatus

from flask_restful import Resource
from flask_restful import reqparse

from models.pin_location_data import Tracker

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GetTracker(Resource):
    """
    Get Tracker
    """

    def __init__(self) -> None:
        """
        Set required arguments for Get request
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('id', required=True, type=str)

    def get(self) -> (str, HTTPStatus):
        """
        Get Tracker
        :param tracker_id: Tracker Id number
        :return: Tracker and an HTTPStatus of 200 (OK) otherwise, a JSON error message with an HTTPStatus
                 404 (Not Found)
        """
        args = self.reqparser.parse_args()
        tracker = Tracker.get_by_tracker_id(args["id"])
        if tracker:
            return tracker.json, HTTPStatus.OK

        return {"error": "Tracker not found", "id": args["id"]}, HTTPStatus.NOT_FOUND
