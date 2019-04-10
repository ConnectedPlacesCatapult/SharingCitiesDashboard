import logging
import random
from http import HTTPStatus

import pandas as pd
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import reqparse
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError

from db import db
from models.pin_location_data import Tracker, LocationData
from models.theme import Theme, SubTheme

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GetDummyData(Resource):
    """
    Put Dummy Location data and trackers into the database
    """

    def __init__(self) -> None:
        """
        Sets the required arguments to be in the POST request
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('file_name', type=str, required=False,
                                    default='bike_test_data.csv')

        self.t_ids = {}
        self.loc_stats = dict(before=0, after=0)
        self.tracker_stats = dict(before=0, after=0)

    @jwt_required
    def post(self) -> (dict, HTTPStatus):
        """
        Get dummy data from CSV. Store dummy data in database
        :param file_name: File name to extract data from.
        :return: A Status Report detailing the dB Entries created and an HTTP
        Status code 200 on success otherwise, a JSON error message is returned
        with the appropriate HTTPStatus code
        """
        args = self.reqparser.parse_args()
        # Get size of tables before import
        self.loc_stats["before"] = db.session.query(
            func.count(LocationData.id)).scalar()
        self.tracker_stats["before"] = db.session.query(
            func.count(Tracker.id)).scalar()

        # Fetch Data from CSV
        try:
            df = pd.read_csv(args['file_name'])
        except IOError as ioe:
            logger.error("Unable to parse CSV data to dataframe",
                         ioe.with_traceback(ioe.__traceback__))
            return dict(error="Unable to parse CSV data to dataframe",
                        trackback=ioe.with_traceback(
                            ioe.__traceback__)), HTTPStatus.BAD_REQUEST

        moving_theme = Theme.get_by_name("Moving_Sensors")
        if moving_theme:
            moving_sensor_theme_id = moving_theme.id
        else:
            moving_sensor_theme = Theme("Moving_Sensors")
            moving_sensor_theme.save()
            moving_sensor_theme.commit()
            moving_sensor_theme_id = moving_sensor_theme.id

        moving_subtheme = SubTheme.get_by_name("Moving_Airquality")
        if moving_subtheme:
            moving_sensor_subtheme_id = moving_subtheme.id
        else:
            moving_sensor_subtheme = SubTheme(moving_sensor_theme_id,
                                              "Moving_Airquality")
            moving_sensor_subtheme.save()
            moving_sensor_subtheme.commit()
            moving_sensor_subtheme_id = moving_sensor_subtheme.id


        # Trackers must be unique, Fetch trackers and make dB entries for
        # each unique tracker
        unique_tracker_ids = df["tracker"].unique()

        for tracker_id in unique_tracker_ids:
            self.t_ids[self.create_trackers(str(tracker_id),
                                            moving_sensor_subtheme_id)] = 0

        # Define Location data Pandas DataFrame Column names
        loc_df = df[
            ['tracker', 'datetime', 'latitude', 'longitude', 'speed',
             'heading', 'elevation', 'charger', 'battery',
             'signalquality', 'satcnt']]

        # Drop all entries that are incomplete have NaN or None/ Null values
        loc_df = loc_df.dropna()

        # Store Location Data in the dB
        for index, row in loc_df.iterrows():
            self.add_location_data(row['tracker'], row['datetime'],
                                   row['latitude'], row['longitude'],
                                   row['speed'],
                                   row['heading'], row['elevation'],
                                   row['charger'], row['battery'],
                                   row['signalquality'], row['satcnt'])

        self.loc_stats["after"] = db.session.query(
            func.count(LocationData.id)).scalar()
        self.tracker_stats["after"] = db.session.query(
            func.count(Tracker.id)).scalar()

        return self.status_report(), 200

    def create_trackers(self, tid: str, subtheme_id: int) -> str:
        """
        Create new Tracker
        :param tid: Tracker Id
        :return: The Tracker Id
        """
        tracker = Tracker(tid, subtheme_id)
        tracker.save()
        tracker.commit()
        return tid

    def add_location_data(self, tracker_id: str, measurement_date: str,
                          latitude: float, longitude: float, speed: float,
                          heading: float, elevation: float, charger: bool,
                          battery: float, signalquality: int,
                          satcnt: int) -> None:
        """
        Create LocationData
        :param tracker_id: Trackers Id
        :param measurement_date: Date and time of when the measurement was made
        :param latitude: GPS Latitude coordinate in Decimal Degree(DD.ddddddd)
        :param longitude: GPS Latitude coordinate in Decimal Degree(DD.ddddddd)
        :param speed: Velocity of receiver in meters per second
        :param heading: Heading in degrees
        :param elevation: Altitude above Mean Seal Level (MSL) in meters
        :param charger: Charging True or False
        :param battery: Battery level in percent
        :param signalquality: RSSI signal to noise radio in decibels (dB)
        :param satcnt: Number of GPS satellites in use
        """

        try:
            value = None
            if tracker_id == 2018:
                value = {"o3": str(random.uniform(0, 100))}
            elif tracker_id == 2020:
                value = {"o3": str(random.uniform(0, 100)),
                         "no2": str(random.uniform(0, 100))}
            elif tracker_id == 2021:
                value = {"o3": str(random.uniform(0, 100)),
                         "no2": str(random.uniform(0, 100)),
                         "co2": str(random.uniform(0, 100))}
            elif tracker_id == 2022:
                value = {"o3": str(random.uniform(0, 100)),
                         "no2": str(random.uniform(0, 100)),
                         "co2": str(random.uniform(0, 100)),
                         "so2": str(random.uniform(0, 100))}
            elif tracker_id == 2025:
                value = {"no2": str(random.uniform(0, 100)),
                         "co2": str(random.uniform(0, 100))}

            loc_data = LocationData.builder(tracker_id=tracker_id,
                                            measurement_date=measurement_date,
                                            latitude=latitude,
                                            longitude=longitude, speed=speed,
                                            heading=heading,
                                            elevation=elevation,sat_cnt=satcnt,
                                            fix_quality=1,
                                            signal_quality=signalquality,
                                            battery=battery, charger=charger,
                                            value=value)
            loc_data.save()
            loc_data.commit()
        except IntegrityError as ite:
            logger.error("Unable to commit new location data to db",
                         ite.with_traceback(ite.__traceback__))

    def status_report(self) -> dict:
        """
        Create Report of changes to the database tables
        :return: Json report of new entry counts created during dump
        """
        return {
            "Location_Data":
                {
                    "Before": self.loc_stats["before"],
                    "After": self.loc_stats["after"],
                    "New": self.loc_stats["after"] - self.loc_stats["before"]
                },
            "Tracker":
                {
                    "Before": self.tracker_stats["before"],
                    "After": self.tracker_stats["after"],
                    "New": self.tracker_stats["after"] - self.tracker_stats[
                        "before"]
                }
        }
