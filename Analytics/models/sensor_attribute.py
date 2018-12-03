from db import db
from datetime import datetime
from sqlalchemy.exc import IntegrityError

class SensorAttribute(db.Model):
    __tablename__ = 'sensorattribute'

    # id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    # s_id = db.Column(db.Integer, db.ForeignKey('sensor.id'), nullable=False, primary_key=True)
    # a_id = db.Column(db.Integer, db.ForeignKey('attributes.id'), nullable=False, primary_key=True)
    s_id = db.Column(db.Text, nullable=False, primary_key=True)
    a_id = db.Column(db.Text, nullable=False, primary_key=True)
    timestamp = db.Column(db.DateTime)

    def __init__(self, s_id, a_id, timestamp=None):
        self.s_id = s_id
        self.a_id = a_id

        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self):
        return 'Sensor ID: %s, Attribute Id: %s' % (self.s_id, self.a_id)
    
    def json(self):
        return {
            'Sensor ID': self.s_id,
            'Attriubte ID': self.a_id,
            'Timestamp': self.timestamp
        }

    def save(self):
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError:
            db.session.rollback()
            print('Sensor ID: %s, Attribute Id: %s already exists' % (self.s_id, self.a_id))

    def commit(self):
        db.session.commit()

    @classmethod
    def get_by_id_in(cls, ids):
        return db.session.query(SensorAttribute).filter(SensorAttribute.s_id.in_((ids))).all()

    @classmethod
    def _get_by_sid_aid(cls, s_id, a_id):
        return SensorAttribute.query.filter_by(s_id=s_id).filter_by(a_id=a_id).first()

