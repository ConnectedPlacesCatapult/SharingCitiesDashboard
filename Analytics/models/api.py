
from db import db
from datetime import datetime

class API(db.Model):
    __tablename__ = 'api'
    __bind_key__ = 'backend'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    url = db.Column(db.String(255), nullable=False, unique=True)
    timestamp = db.Column(db.DateTime)
    devices = db.relationship('Devices', backref='api', lazy=True)

    def __init__(self, name, url, timestamp=None):
        self.name = name
        self.url = url
        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self):
        return 'Name: %s, Url: %s' % (self.name, self.url)

    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'url': self.url,
            'timestamp': self.timestamp
        }