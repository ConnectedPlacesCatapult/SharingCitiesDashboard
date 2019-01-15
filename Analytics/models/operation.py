'''
Data class for storing data about what is operation requested by user while performing analytics
'''
from db import db
from datetime import datetime

class Operation(db.Model):
    __tablename__ = 'operation'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    timestamp = db.Column(db.DateTime)

    def __init__(self, name, timestamp=None):
        self.name = name
        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self):
        return self.name

    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'timestamp': self.timestamp
        }

    @classmethod
    def get_operation(cls, name):
        return cls.query.filter_by(name=name).first() 