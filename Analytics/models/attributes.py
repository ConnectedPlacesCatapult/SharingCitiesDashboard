from db import db
from datetime import datetime

class Attributes(db.Model):
    __tablename__ = 'attributes'
    __bind_key__ = 'backend'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    table_name = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime)

    def __init__(self, name, table_name, timestamp=None):
        self.name = name
        self.table_name = table_name

        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self):
        return 'Name: %s, Table Name: %s' % (self.name, self.table_name)

    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'table_name': self.table_name,
            'timestamp': self.timestamp
        }