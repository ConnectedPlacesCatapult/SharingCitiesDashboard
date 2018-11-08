from db import db
from datetime import datetime
from sqlalchemy.exc import IntegrityError

class Sensor(db.Model):
    __tablename__ = 'sensor'
    # __bind_key__ = 'backend'

    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    a_id = db.Column(db.Integer, db.ForeignKey('api.id'))
    l_id = db.Column(db.Integer, db.ForeignKey('location.id'), primary_key=True)
    name = db.Column(db.String(255), nullable=False, primary_key=True)
    timestamp = db.Column(db.DateTime)

    # attributes = db.relationship('Attributes', backref='sensor', lazy=True)

    def __init__(self, a_id, l_id, name, timestamp=None):
        self.a_id = a_id
        self.l_id = l_id
        self.name = name

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
            'Timestamp': self.timestamp
        }

    def save(self):
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            print(self.name, 'sensor already exists with Attribute ID:', str(self.a_id), 'and Location ID:', str(self.l_id))

    def save_all(self):
        db.session.add(self)

    def get(self):
        return Sensor.query.filter_by(l_id=self.l_id, name=self.name).first()
