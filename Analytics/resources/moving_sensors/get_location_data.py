from http import HTTPStatus

from flask_restful import Resource
from flask_restful import reqparse

from models.pin_location_data import Tracker, LocationData


class GetLocationData(Resource):
    """
    Fetch Theme Tree Themes
    """

    def __init__(self) -> None:
        """
        Set required arguments for POST request
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('tracker_id', required=True, type=str)
        self.reqparser.add_argument('start_date', required=False, store_missing=False, type=str)
        self.reqparser.add_argument('end_date', required=False, store_missing=False, type=str)

    def get(self):
        args = self.reqparser.parse_args()
        print(args)
        tracker = Tracker.get_by_tracker_id(args["tracker_id"])
        if not tracker:
            return {"error": "tracker with id {} not found".format(args["tracker_id"])}, HTTPStatus.NOT_FOUND

        if 'start_date' in args and 'end_date' in args:
            loc_data_models = LocationData.get_by_date_range(args["tracker_id"], args["start_date"], args["end_date"])
            if isinstance(loc_data_models, list):
                result = [lcdm.json for lcdm in loc_data_models]
            else:
                result = loc_data_models.json
            return result, 200
        return tracker.json, 200
