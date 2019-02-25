'''
Data class to store information about Units of values
'''
import logging
from datetime import datetime
from typing import NoReturn

from sqlalchemy.exc import IntegrityError

from db import db

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class Unit(db.Model):
    """
    A Database model for storing the Units of measure. The class handles all the database CRUD operations need to
    persist and utilise a unit of measure
    :param  id:             primary key
    :param  discription:    discription of the unit of measure
    :param  symbol:         measure ment units symbol

    :type id:       int
    :type user_id:  str
    :type data:     str
    """
    __tablename__ = 'unit'

    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column('_type', db.String(255), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime)

    # Temporary commenting
    # attributes = db.relationship('Attributes', backref='unit', lazy=True)

    def __init__(self, _type, description, timestamp=None) -> None:
        """ Instantiate the Unit database model object"""
        self.symbol = _type
        self.description = description

        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self) -> str:
        return 'Unit Type: %s, Description: %s' % (self.symbol, self.description)

    def json(self) -> dict:
        """:returns a json format of the unit"""
        return {
            'id': self.id,
            'Type': self.symbol,
            'Description': self.description,
            'Timestamp': self.timestamp.__str__()
        }

    def save(self) -> NoReturn:
        """ Creates/Updates a unit entry in the database"""
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            logger.error(ie)
            db.session.rollback()
            print(self.symbol, 'unit already exists')

    def commit(self) -> NoReturn:
        """ Commits session changes to the database"""
        db.session.commit()

    def delete(self) -> NoReturn:
        """ Deletes a unit entry from the database"""
        try:
            db.session.delete(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(ie)
            print(self.symbol, 'unit does not exist')

    @classmethod
    def get(cls) -> [db.Model]:
        """ Fetches all unit entries from the db"""
        return Unit.query.all()

    @classmethod
    def get_with_limit(cls, limit) -> [db.Model]:
        """ Fetches unit entries from the db with a maximum count of <limit>"""
        return Unit.query.limit(limit)

    @classmethod
    def get_by_id(cls, id) -> db.Model:
        """ Fetches a unit by its id """
        return Unit.query.filter_by(id=id).first()

    @classmethod
    def get_by_symbol(cls, symbol: str) -> db.Model:
        """ Fetches a unit by its symbol """
        return Unit.query.filter_by(symbol=symbol).first()

    @classmethod
    def get_by_description(cls, description: str) -> db.Model:
        """ Fetches a unit by its description """
        return Unit.query.filter_by(description=description).first()
