from db import db
from datetime import datetime

class RequestTablesCols(db.Model):
    __tablename__ = 'requesttablescols'

    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('requestanalytics.id'))
    table_name = db.Column(db.String(255), nullable=False)
    col_name = db.Column(db.String(255), nullable=False)
    type_col = db.Column(db.String(80), nullable=False)
    timestamp = db.Column(db.DateTime)

    def __init__(self, request_id, table_name, col_name, type_col, timestamp=None):
        self.request_id = request_id
        self.table_name = table_name
        self.col_name = col_name
        self.type_col = type_col

        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self):
        return self.request_id

    def json(self):
        return {
            'id': self.id,
            'request_id': self.request_id,
            'table_name': self.table_name,
            'col_name': self.col_name,
            'type_col': self.type_col,
            'timestamp': self.timestamp
        }
    
    def add_to_session(self):
        db.session.add(self)
        db.session.flush()