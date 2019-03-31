import logging
from http import HTTPStatus

from flask_restful import Resource
from flask_restful import reqparse

from models.pin_location_data import Tracker

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CreateTracker(Resource):
    """
    Create Tracker
    """

    def __init__(self) -> None:
        """
        Set required arguments for POST request
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('id', required=True, type=str)
        self.reqparser.add_argument('description', required=False, default="", type=str)

    def post(self) -> (str, HTTPStatus):
        """
        Create new Tracker
        :param tracker_id: Tracker Id number
        :param description: Description of the tracker
        :param timestamp:  Optional Timestamp of when the tracker was activated. Defaults to datetime.now()
        :return: Tracker id and an HTTPStatus code 201 (CREATED) on success, otherwise a JSON error response containing
                 The tracker id and an HTTPStatus of 500 (Internal Server Error)
        """
        args = self.reqparser.parse_args()
        tracker = Tracker.get_by_tracker_id(args["id"])
        if tracker:
            return {"error": "Tracker already exists", "tracker": tracker.json}, HTTPStatus.BAD_REQUEST

        tracker = Tracker(args["id"], args["description"])

        tracker.save()
        tracker.commit()
        if Tracker.get_by_tracker_id(args["id"]):
            return tracker.json, HTTPStatus.CREATED

        return {"error": "Failed to create Tracker", "id": args["id"]}, HTTPStatus.INTERNAL_SERVER_ERROR
