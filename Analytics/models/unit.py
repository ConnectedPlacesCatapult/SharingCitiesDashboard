'''
Data class to store information about Units of values
'''
from datetime import datetime

from sqlalchemy.exc import IntegrityError

from db import db


class Unit(db.Model):
    __tablename__ = 'unit'

    id = db.Column(db.Integer, primary_key=True)
    _type = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime)

    # Temporary commenting
    # attributes = db.relationship('Attributes', backref='unit', lazy=True)

    def __init__(self, _type, description, timestamp=None):
        self._type = _type
        self.description = description

        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self):
        return 'Unit Type: %s, Description: %s' % (self._type, self.description)

    def json(self):
        return {
            'id': self.id,
            'Type': self._type,
            'Description': self.description,
            'Timestamp': self.timestamp.__str__()
        }

    def save(self):
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            print(self._type, 'unit already exists')

    def delete(self):
        try:
            db.session.delete(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            print(self._type, 'unit already exists')

    def commit(self):
        db.session.commit()

    @classmethod
    def get(cls):
        return Unit.query.all()
    
    @classmethod
    def get_by_id(cls, id):
        return Unit.query.filter_by(id=id).first()

    @classmethod
    def get_by(cls, **kwargs):
        """ Fetches a Unit entry from the database"""
        return Unit.query.filter_by(**kwargs).all()
