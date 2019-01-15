'''
Data class to store information about using what columns user want to perform analytics
'''
from db import db
from datetime import datetime

class RequestTablesCols(db.Model):
    __tablename__ = 'requesttablescols'

    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('requestanalytics.id'))
    table_name = db.Column(db.String(255), nullable=False)
    col_name = db.Column(db.String(255), nullable=False)
    filter_type = db.Column(db.String(255))
    filters = db.Column(db.String(255))
    type_col = db.Column(db.String(80), nullable=False)
    timestamp = db.Column(db.DateTime)

    def __init__(self, request_id, table_name, col_name, type_col, filter_type='None', filters='None', timestamp=None):
        self.request_id = request_id
        self.table_name = table_name
        self.col_name = col_name
        self.type_col = type_col
        self.filter_type = filter_type
        self.filters = filters

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
            'filter_type': self.filter_type,
            'filters': self.filters,
            'timestamp': self.timestamp
        }
    
    def add_to_session(self):
        db.session.add(self)
        db.session.flush()