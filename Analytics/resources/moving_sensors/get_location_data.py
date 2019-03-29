from datetime import datetime
from http import HTTPStatus

from flask_restful import Resource
from flask_restful import reqparse

from models.pin_location_data import LocationData, Tracker


class GetLocationData(Resource):
    """
    Fetch Location Data
    """

    def __init__(self) -> None:
        """
        Set required arguments for GET request
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('tracker_id', required=False, store_missing=False, type=str)
        self.reqparser.add_argument('start_date', required=False, default=datetime.now(),
                                    help='Datetime Format: %d/%m/%y',
                                    type=lambda x: datetime.strptime(x, '%d/%m/%y'))
        self.reqparser.add_argument('end_date', required=False, default=datetime.now(),
                                    help='Datetime Format: %d/%m/%y',
                                    type=lambda x: datetime.strptime(x, '%d/%m/%y'))

    def get(self) -> (dict, HTTPStatus):
        """
        Fetch location data by date range
        :param tracker_id: tracker Id
        :param start_date: Date to start
        :param end_date: Date to end (inclusive)
        :return: Location data JSON serialized
        """
        args = self.reqparser.parse_args()
        if "tracker_id" in args:
            tracker = Tracker.get_by_tracker_id(args["tracker_id"])
            if not tracker:
                return dict(error="tracker id not found", id=args["tracker_id"]), HTTPStatus.NOT_FOUND

        if 'start_date' in args and 'end_date' in args:
            loc_data_models = LocationData.get_by_date_range(**args)
            if isinstance(loc_data_models, list):
                result = [lcdm.json for lcdm in loc_data_models]
            else:
                result = loc_data_models.json
            return result, HTTPStatus.OK
