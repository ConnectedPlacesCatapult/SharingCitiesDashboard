from db import db
from datetime import datetime
from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError
from geoalchemy2 import Geometry

class Location(db.Model):
    __tablename__ = 'location'
    # __bind_key__ = 'backend'

    id = db.Column(db.Integer, primary_key=True)
    lat = db.Column(db.Float, nullable=False)
    lon = db.Column(db.Float, nullable=False)
    geo = db.Column(Geometry(srid=4326))

    sensors = db.relationship('Sensor', backref='location', lazy=True)

    def __init__(self, lat, lon, geo):
        self.lat = lat
        self.lon = lon
        self.geo = geo

    def __repr__(self):
        return 'Latitude: %f, Longitude: %f' % (self.lat, self.lon)

    def json(self):
        return {
            'id': self.id,
            'Latitude': self.lat,
            'Longitude': self.lon
        }

    def save(self):
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            print('Location with Latitude: ', str(self.lat), 'and Longitude: ', self(self.lon), 'already exists')

    def get(self):
        return Location.query.filter_by(lat=self.lat, lon=self.lon).first()

    @classmethod
    def get_by_id(cls, id):
        return Location.query.filter_by(id=id).first()

    @classmethod
    def get_by_id_in(cls, ids):
        return db.session.query(Location).filter(Location.id.in_((ids))).all()

    @classmethod
    def get_by_lat_lon(cls, lat, lon):
        loc = None
        try:
            loc = Location.query.filter_by(lat=lat, lon=lon).first()
        except Exception:
            print('yes the exception is here')
        return loc


