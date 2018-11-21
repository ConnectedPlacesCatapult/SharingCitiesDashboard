from db import db
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import FlushError

class Sensor(db.Model):
    __tablename__ = 'sensor'
    # __bind_key__ = 'backend'

    id = db.Column(db.Text, unique=True, nullable=False)
    a_id = db.Column(db.Integer, db.ForeignKey('api.id'), primary_key=True)
    l_id = db.Column(db.Integer, db.ForeignKey('location.id'), primary_key=True)
    name = db.Column(db.String(255), nullable=False, primary_key=True)
    timestamp = db.Column(db.DateTime)

    # attributes = db.relationship('Attributes', backref='sensor', lazy=True)

    def __init__(self, id, a_id, l_id, name, timestamp=None):
        self.id = id
        self.a_id = a_id
        self.l_id = l_id
        self.name = name

        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self):
        return 'Name: %s, Api Name: %d' % (self.name, self.a_id)

    def json(self):
        return {
            'id': self.id,
            'Api id': self.a_id,
            'Location id': self.l_id,
            'Name': self.name,
            'Timestamp': self.timestamp
        }

    def save(self):
        try:
            db.session.add(self)
            db.session.flush()
        except (IntegrityError, FlushError) as ie:
            db.session.rollback()
            print(self.name, 'sensor already exists with API ID:', str(self.a_id), 'and Location ID:', str(self.l_id))
            return self.get_by_api_location_name()
        
        return self

    def save_all(self):
        db.session.add(self)

    def get(self):
        return Sensor.query.filter_by(l_id=self.l_id, name=self.name).first()

    @classmethod
    def get_by_name(cls, name):
        return Sensor.query.filter_by(name=name).first()

    @classmethod
    def get_by_name_loc(cls, name, loc_id):
        return Sensor.query.filter_by(l_id=loc_id, name=name).first()

    @classmethod
    def get_by_name_api(cls, name, api_id):
        return Sensor.query.filter_by(a_id=api_id, name=name).first()

    @classmethod
    def get_by_name_in(cls, names):
        return db.session.query(Sensor).filter(Sensor.name.in_((names))).all()

    def get_by_api_location_name(self):
        return Sensor.query.filter_by(a_id=self.a_id, name=self.name, l_id=self.l_id).first()
