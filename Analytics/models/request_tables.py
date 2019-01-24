'''
Data class to store information about the tables requested to perform analytics upon
'''
from db import db
from datetime import datetime

class RequestTables(db.Model):
    __tablename__ = 'requesttables'

    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('requestanalytics.id'))
    table_name = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime)

    def __init__(self, request_id, table_name, timestamp=None):
        self.request_id = request_id
        self.table_name = table_name
        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self):
        return self.id

    def json(self):
        return {
            'id': self.id,
            'request_id': self.request_id,
            'table_name': self.table_name,
            'timestamp': self.timestamp
        }

    def add_to_session(self):
        db.session.add(self)
        db.session.flush()
