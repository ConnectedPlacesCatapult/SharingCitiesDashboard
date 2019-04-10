import logging
from datetime import datetime
from http import HTTPStatus

from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import reqparse

from models.pin_location_data import LocationData, Tracker

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AddNewLocationData(Resource):
    """
    Add new Location data
    """

    def __init__(self) -> None:
        """
        Set required arguments for POST request
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('tracker_id', required=True, type=str)
        self.reqparser.add_argument('measurement_date', required=True,
                                    type=lambda x: datetime.strptime(x,
                                                                     '%d/%m/%Y %H:%M'))
        self.reqparser.add_argument('latitude', required=True, type=float)
        self.reqparser.add_argument('longitude', required=True, type=float)
        self.reqparser.add_argument('speed', required=True, type=float)
        self.reqparser.add_argument('heading', required=True, type=float)
        self.reqparser.add_argument('elevation', required=True, type=float)
        self.reqparser.add_argument('charger', required=True, type=bool)
        self.reqparser.add_argument('battery', required=True, type=float)
        self.reqparser.add_argument('signal_quality', required=True,
                                    type=float)
        self.reqparser.add_argument('sat_cnt', required=True, type=int)
        self.reqparser.add_argument('value', required=True, type=str)
        self.reqparser.add_argument('fix_quality', required=True, type=int)

        
    @jwt_required
    def post(self) -> (str, HTTPStatus):
        """
        Create new location data
        :param tracker_id: Tracker Id number
        :param measurement_date: When the measurement was taken
        :param longitude: GPS Longitudinal Coordinate in decimal
               degrees (DD.ddddddd)
        :param latitude: GPS Latitudinal Coordinate in decimal degrees
               (DD.ddddddd)
        :param speed: Velocity of receiver in meters per second
        :param heading: Heading (Direction of travel in degrees clockwise from
               North(0 degrees)
        :param elevation: Height in meters above MSL (Mean Sea Level)
        :param charger: Charging True or False
        :param sat_cnt: GPS Satellite count in use at time of measurement
        :param fix_quality: GPS Fix quality ( 0: not fix, 1: GPS Fix,
               2: DGPS, etc...)
        :param signal_quality: RSSI of tracker signal
        :param battery: Battery level in percentage full
        :param value: Value to be stored for location
        :return: A Json response with the Location Data Id , Tracker id and an
                HTTPStatus code 201 (CREATED)
        """
        args = self.reqparser.parse_args()
        # Fetch tracker
        if Tracker.get_by_tracker_id(args["tracker_id"]):
            loc_data = LocationData.builder(**args)
            loc_data.save()
            loc_data.commit()
            return dict(id=loc_data.id,
                        tracker_id=loc_data.tracker_id), HTTPStatus.CREATED
        return dict(error="Tracker Not Found",
                    tracker_id=args["tracker_id"]), HTTPStatus.NOT_FOUND
