from db import db
from datetime import datetime

class RequestAnalytics(db.Model):
    __tablename__ = 'requestanalytics'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    operation_id = db.Column(db.Integer, db.ForeignKey('operation.id'))
    status = db.Column(db.String(80), nullable=False)
    timestamp = db.Column(db.DateTime)

    def __init__(self, user_id, operation_id, status, timestamp=None):
        self.user_id = user_id
        self.operation_id = operation_id
        self.status = status

        if timestamp is None:
            timestamp = datetime.utcnow()
        
        self.timestamp = timestamp

    def __repr__(self):
        return sellf.id

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