from db import db
from datetime import datetime

class Devices(db.Model):
    __tablename__ = 'devices'
    __bind_key__ = 'backend'

    id = db.Column(db.Integer, primary_key=True)
    a_id = db.Column(db.Integer, db.ForeignKey('api.id'))
    l_id = db.Column(db.Integer, db.ForeignKey('location.id'))
    name = db.Column(db.String(255), nullable=False)
    unit = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime)

    def __init__(self, a_id, l_id, name, unit, timestamp=None):
        self.a_id = a_id
        self.l_id = l_id
        self.name = name
        self.unit = unit

        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self):
        return 'Name: %s, Api Name: %s' % (self.name, self.a_id.name)

    def json(self):
        return {
            'id': self.id,
            'Api id': self.a_id,
            'Location id': self.l_id,
            'Name': self.name,
            'Unit': self.unit,
            'Timestamp': self.timestamp
        }
