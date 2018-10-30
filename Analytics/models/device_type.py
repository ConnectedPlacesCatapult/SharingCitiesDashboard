from db import db
from datetime import datetime

class DeviceType(db.Model):
    __tablename__ = 'devicetype'
    __bind_key__ = 'backend'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    timestamp = db.Column(db.DateTime)

    def __init__(self, name, timestamp=None):
        self.name = name
        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self):
        return 'Name: %s' % self.name

    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'timestamp': self.timestamp
        }