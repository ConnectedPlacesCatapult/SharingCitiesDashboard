from db import db
from datetime import datetime

class Location(db.Model):
    __tablename__ = 'location'
    __bind_key__ = 'backend'

    id = db.Column(db.Integer, primary_key=True)
    lat = db.Column(db.Float, nullable=False)
    lon = db.Column(db.Float, nullable=False)

    devices = db.relationship('Devices', backref='location', lazy=True)

    def __init__(self, lat, lon):
        self.lat = lat
        self.lon = lon

    def __repr__(self):
        return 'Latitude: %f, Longitude: %f' % (self.lat, self.lon)

    def json(self):
        return {
            'id': self.id,
            'Latitude': self.lat,
            'Longitude': self.lon
        }