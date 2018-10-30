from db import db
from datetime import datetime

class ResultError(db.Model):
    __tablename__ = 'resulterror'

    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('requestanalytics.id'))
    error_rate = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.Datetime)

    def __init__(self, request_id, error_rate, timestamp=None):
        self.request_id = request_id
        self.error_rate = error_rate

        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self):
        return 'Request Id: %d, Error Rate: %d' % (self.request_id, self.error_rate)

    def json(self):
        return {
            'id': self.id,
            'request_id': self.request_id,
            'error_rate': self.error_rate,
            'timestamp': self.timestamp
        }