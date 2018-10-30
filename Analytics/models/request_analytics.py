from db import db
from datetime import datetime

class RequestAnalytics(db.Model):
    __tablename__ = 'requestanalytics'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    operation_id = db.Column(db.Integer, db.ForeignKey('operation.id'))
    timeseries = db.Column(db.Boolean, nullable=False)
    missing_values = db.Column(db.String(80), nullable=False)
    data_range_from = db.Column(db.String(80), nullable=True)
    data_range_to = db.Column(db.String(80), nullable=True)
    status = db.Column(db.String(80), nullable=False)
    timestamp = db.Column(db.DateTime)

    def __init__(self, user_id, operation_id, timeseries, status, missing_values, 
                        data_range_from=None, data_range_to=None, timestamp=None):
        self.user_id = user_id
        self.operation_id = operation_id
        self.timeseries = timeseries
        self.status = status
        self.missing_values = missing_values
        self.data_range_from = data_range_from
        self.data_range_to = data_range_to

        if timestamp is None:
            timestamp = datetime.utcnow()
        
        self.timestamp = timestamp

    def __repr__(self):
        return self.id

    def json(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'operation_id': self.operation_id,
            'status': self.status,
            'timestamp': self.timestamp
        }

    def save(self):
        db.session.add(self)
        db.session.flush()