import logging
from datetime import datetime
import json
from typing import Union

from sqlalchemy.exc import IntegrityError

from db import db

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class AttributeRange(db.Model):
    """
    Data class for storing information about Attribute Ranges
    """
    __tablename__ = 'attribute_range'

    id = db.Column(db.Integer, primary_key=True)
    attribute_id = db.Column(db.Text, db.ForeignKey('attributes.id'),
                             nullable=False)
    minimum_sensor_id = db.Column(db.Text, db.ForeignKey('sensor.id'))
    minimum = db.Column(db.Float)
    minimum_recorded_date = db.Column(db.DateTime)
    maximum_sensor_id = db.Column(db.Text, db.ForeignKey('sensor.id'))
    maximum = db.Column(db.Float)
    maximum_recorded_date = db.Column(db.DateTime)
    latest_update = db.Column(db.DateTime)

    def __init__(self, attribute_id: str, minimum_sensor_id: Union[str, None],
                 minimum: Union[float, None],
                 minimum_recorded_date: Union[datetime, None],
                 maximum_sensor_id: Union[str, None],
                 maximum: Union[float, None],
                 maximum_recorded_date: Union[datetime, None],
                 timestamp: datetime = datetime.now()):
        """
        Initialise the Attribute Range object instance
        :param attribute_id: An attribute's id in the attributes table
        :param minimum_sensor_id: ID of the sensor that sensed the minimum
                                  attribute value
        :param minimum: minimum value for the attribute
        :param minimum_recorded_date: Timestamp of when the minimum
                                      attribute value was recorded
        :param maximum_sensor_id: ID of the sensor that sensed the maximum
                                  attribute value
        :param maximum: maximum value for the attribute
        :param maximum_recorded_date: Timestamp of when the maximum
                                      attribute value was recorded
        :param timestamp: when the Attribute Range entry was last updated
        """

        self.attribute_id = attribute_id
        self.minimum_sensor_id = minimum_sensor_id
        self.minimum = minimum
        self.minimum_recorded_date = minimum_recorded_date
        self.maximum_sensor_id = maximum_sensor_id
        self.maximum = maximum
        self.maximum_recorded_date = maximum_recorded_date
        self.latest_update = timestamp

    def __str__(self) -> str:
        """
        Override dunder string method to cast Attribute Range object
        attributes to a string
        :return: a JSON string of the Attribute Range object attributes
        """
        return json.dumps(self.json())

    def json(self) -> dict:
        """
        Create a JSON dict of the Attribute Range object attributes
        :return: the Attribute Range object attributes as a JSON (dict)
        """
        return {
            'attribute_id': self.attribute_id,
            'minimum_sensor_id': self.minimum_sensor_id,
            'minimum': self.minimum,
            'minimum_recorded_date': str(self.minimum_recorded_date),
            'maximum_sensor_id': self.maximum_sensor_id,
            'maximum': self.maximum,
            'maximum_recorded_date': str(self.maximum_recorded_date),
            'latest_update': str(self.latest_update)
        }

    def save(self):
        """
        Add the current Attribute Range fields to the SQLAlchemy session
        """
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(str(self.id) +
                         ' attribute range entry already exists ')

    def delete(self):
        """
        Add the current Attribute Range fields to the SQLAlchemy session to be
        deleted
        """
        try:
            db.session.delete(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error('Attribute Range id ' + str(self.id) +
                         ' does not exists')

    def commit(self) -> None:
        """ Commit changes to database"""
        db.session.commit()

    @classmethod
    def get_all(cls) -> db.Model:
        """
        Fetch all Attribute Range entries
        :return: All persisted Attribute Range entries
        """
        return AttributeRange.query.all()

    @classmethod
    def get_by_attr_id(cls, attr_id: str) -> db.Model:
        """
        Fetch Attribute Range according to Attribute id
        :return: Attribute with id parsed
        """
        return AttributeRange.query.filter_by(attribute_id=attr_id).first()
