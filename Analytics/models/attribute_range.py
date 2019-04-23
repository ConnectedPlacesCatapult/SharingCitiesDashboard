import logging
from datetime import datetime
import json

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
    minimum = db.Column(db.Float)
    maximum = db.Column(db.Float)
    latest_update = db.Column(db.DateTime)

    def __init__(self, attribute_id: int, minimum: float, maximum: float,
                 timestamp: datetime = datetime.now()):
        """
        Initialise the Attribute Range object instance
        :param attribute_id: An attribute's id in the attributes table
        :param minimum: minimum value for the attribute
        :param maximum: maximum value for the attribute
        :param timestamp: time stamp of when the prediction was associated
        with a user
        """
        self.attribute_id = attribute_id
        self.minimum = minimum
        self.maximum = maximum
        self.latest_update = timestamp

    def __str__(self) -> str:
        """
        override dunder string method to cast Attribute Range object
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
            'minimum': self.minimum,
            'maximum': self.maximum,
            'latest_update': self.latest_update
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
            logger.error(str(self.user_id) +
                         ' User already is associated with ' + str(
                self.pred_result_id))

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
            logger.error(str(self.user_id) + ' User Prediction ID does not '
                                             'exists')

    def commit(self) -> None:
        """ Commit changes to database"""
        db.session.commit()

    @classmethod
    def get_by_attr_id(cls, attr_id: str) -> db.Model:
        """
        Fetch Attribute Range by Attribute id
        :return:    Attribute with id parsed
        """
        return AttributeRange.query.filter_by(attribute_id=attr_id).first()

