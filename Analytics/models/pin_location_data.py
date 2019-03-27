import logging
import random
from datetime import datetime
from typing import Union

from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError

from db import db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Tracker(db.Model):
    __tablename__ = 'tracker'

    id = db.Column(db.Text, unique=True, primary_key=True, autoincrement=False, nullable=False)
    description = db.Column(db.Text, nullable=True)
    activated_date = db.Column(db.DateTime, default=datetime.now, nullable=False)
    loc_data = db.relationship("LocationData", back_populates="tracker",
                               primaryjoin="and_(Tracker.id==LocationData.tracker_id)")

    def __init__(self, tracker_id: str, activated_date: datetime.timestamp = datetime.utcnow()) -> None:
        """
        Instantiate Tracker model
        :param tracker_id: New Tracker Id
        :param activated_date: Date Activated
        """
        self.id = tracker_id
        self.activated_date = activated_date

    @property
    def json(self) -> dict:
        """
        JSON Serialize Objects Attributes
        :return: JSON of the models attributes
        """
        return {
            "id": self.id,
            "activated_on": datetime.strftime(self.activated_date, "%d/%m/%y %H:%M"),
            "location_data": [point.json for point in self.loc_data]
        }

    @property
    def kml_coords(self) -> [dict]:
        """
        Create KML (Key Markup Language) Coordinates List
        :return: KML Formatted GPS Coordinates
        """
        return [coord.kml_coord for coord in self.loc_data]

    def save(self) -> None:
        """
        Add Tracker to session
        """
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError:
            db.session.rollback()
            logger.error("Tracker {} already exists".format(self.id))

    def delete(self) -> None:
        """
        Delete Tracker from session
        """
        try:
            db.session.delete(self)
            db.session.flush()
        except IntegrityError:
            db.session.rollback()
            logger.error("Tracker {} does not exists".format(self.id))

    @staticmethod
    def commit() -> None:
        """ Commit updated items to the database """
        db.session.commit()

    def remove_before(self, date: datetime) -> int:
        """
        Remove Location Data before parsed Date
        :param date: Date to start removing date from Inclusive
        :return: Number of records removed
        """
        # TODO: Implement
        raise NotImplementedError
        pass

    @classmethod
    def get_by_date_range(cls, tracker_id: str, start_date: datetime, end_date: datetime) -> [db.Model]:
        """
        Get Entries by datetime between two dates
        :param tracker_id: Tracker Id number
        :param start_date: From date format 'dd/mm/yy'
        :param end_date: To inclusive date format 'dd/mm/yy'
        :return: A List of LocationData between the start_date and end_date
        """

        ts_start = datetime.strptime(start_date, '%d/%m/%y')
        ts_end = datetime.strptime(end_date, '%d/%m/%y')

        return cls.query.join(LocationData).filter(cls.id == tracker_id) \
            .filter(and_(LocationData.timestamp >= ts_start, LocationData.timestamp <= ts_end)).all()

    @classmethod
    def get_by_tracker_id(cls, tracker_id: str) -> db.Model:
        """
        Get Tracker by id
        :param tracker_id: Tracker id
        :return: Tracker entry
        """
        return cls.query.filter_by(id=tracker_id).first()


class LocationData(db.Model):
    __tablename__ = 'location_data'

    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    speed = db.Column(db.Float, nullable=True)
    heading = db.Column(db.Float, nullable=True)
    elevation = db.Column(db.Float, nullable=False)
    sat_cnt = db.Column(db.Integer, nullable=False)
    fix_quality = db.Column(db.Integer, nullable=False)
    signal_quality = db.Column(db.Integer, nullable=False)
    battery = db.Column(db.Float, nullable=True)
    charger = db.Column(db.Boolean, nullable=True)
    value = db.Column(db.Float, nullable=True)

    tracker_id = db.Column(db.Text, db.ForeignKey('tracker.id'))
    tracker = db.relationship("Tracker", back_populates="loc_data")

    def __init__(self, tracker_id: str, timestamp: datetime, longitude: float, latitude: float,
                 speed: float, heading: float, elevation, sat_cnt: int, fix_quality: int, signal_quality: int,
                 battery: float) -> None:
        """

        :param tracker_id: Tracker Id number
        :param timestamp: When the measurement was taken
        :param longitude: GPS Longitudinal Coordinate in decimal degrees (DD.ddddddd)
        :param latitude: GPS Latitudinal Coordinate in decimal degrees (DD.ddddddd)
        :param speed: Velocity of reciever
        :param heading: Heading (Direction of travel in degrees clockwise from North(0 degrees)
        :param elevation: Height in meters above MSL (Mean Sea Level)
        :param sat_cnt: GPS Satellite count in use at time of measurement
        :param fix_quality: GPS Fix quality ( 0: not fix, 1: GPS Fix, 2: DGPS, etc...)
        :param signal_quality: RSSI of tracker signal
        :param battery: Battery level in percentage full
        """

        self.tracker_id = tracker_id
        self.timestamp = datetime.strptime(timestamp, "%d/%m/%Y %H:%M")
        self.longitude = longitude
        self.latitude = latitude
        self.speed = speed
        self.heading = heading
        self.elevation = elevation
        self.sat_cnt = sat_cnt
        self.fix_quality = fix_quality
        self.signal_quality = signal_quality
        self.battery = battery
        self.value = random.uniform(0, 100)

    @property
    def json(self):
        """
        JSON Serialize LocationData Attributes
        :return:  JSON representation of LocationData instance
        """
        return {"tracker_id": self.tracker_id,
                "timestamp": datetime.strftime(self.timestamp, "%d/%m/%y %H:%M"),
                "coordinates": {"latitude": self.latitude, "logintude": self.longitude, "sat_cnt": self.sat_cnt,
                                "heading": self.heading, "speed": self.speed, "elevation": self.elevation},
                "signal_quality": self.signal_quality,
                "battery": self.battery,
                "value": self.value
                }

    @property
    def kml_coord(self) -> (str, str, str):
        """
        Create KML (Key Markup Language) of Coordinate
        :return: KML Formatted GPS Coordinate
        """
        return str(self.latitude), str(self.longitude), str(self.elevation)



    def save(self) -> None:
        """Add LocationData to Session"""
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError:
            db.session.rollback()
            # logger.error("Tracker {} already exists".format(self.id))

    def delete(self) -> None:
        """Remove LocationData from session"""
        try:
            db.session.delete(self)
            db.session.flush()
        except IntegrityError:
            db.session.rollback()
            # logger.error("Tracker {} does not exists".format(self.id))

    @staticmethod
    def commit() -> None:
        """ Commit updated items to the database """
        db.session.commit()

    @classmethod
    def get_by_date_range(cls, tracker_id: str, start_date: datetime, end_date: datetime) -> [db.Model]:
        """
        Get Entries by DateTime
        :param tracker_id: Tracker Id Number
        :param start_date: Earliest Date to Fetch entries for
        :param end_date: Latest Date to fetch entries for
        :return: List of LocationData entries
        """

        ts_start = datetime.strptime(start_date, '%d/%m/%y')
        ts_end = datetime.strptime(end_date, '%d/%m/%y')

        return cls.query.join(Tracker).filter(Tracker.id == tracker_id) \
            .filter(and_(cls.timestamp >= ts_start, cls.timestamp <= ts_end)).all()

    @classmethod
    def get_by_location(cls, latitude: float, longitude: float, first: bool = True) -> Union[db.Model, list]:
        """
         Fetch database entries by location
        :param latitude: Latitude Decimal Degrees (DD.DDDDD)
        :param longitude: Longitude Decimal Degrees (DD.DDDD)
        :param first: If True only the first matching db entry is returned otherwise all matching db entries
               are returned
        :return: Entries or first entry in database with the matching coordinates
        """
        if first:
            return cls.query.filter_by(latitude=latitude, longitude=longitude).first()
        else:
            return cls.query.filter_by(latitude=latitude, longitude=longitude)

    @classmethod
    def get_by_tracker_id(cls, tracker_id: str, first: bool = True) -> Union[db.Model, list]:
        """
        Get Entry / Entries by Tracker id
        :param tracker_id: Tracker id
        :param first: If True only the first entry found is returned, otherwise all found entries are returned
        :return: Entry or Entries related to the Tracker Id parsed
        """
        if first:
            return cls.query.filter_by(tracker_id=tracker_id).first()
        else:
            return cls.query.filter_by(tracker_id=tracker_id)
