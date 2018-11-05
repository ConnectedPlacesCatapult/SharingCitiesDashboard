from db import db
from datetime import datetime

class Attributes(db.Model):
    __tablename__ = 'attributes'
    # __bind_key__ = 'backend'

    id = db.Column(db.Integer, primary_key=True, unique=True)
    name = db.Column(db.String(255), nullable=False, primary_key=True)
    table_name = db.Column(db.String(255), nullable=False)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=False, primary_key=True)
    unit_value = db.Column(db.Text, nullable=False, primary_key=True)
    description = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime)

    def __init__(self, name, table_name, unit, description='No Description', unit_value='1', timestamp=None):
        self.name = name
        self.table_name = table_name
        self.unit_id = unit
        self.unit_value = unit_value
        self.description = description

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
            'Unit': self.unit_id,
            'Unit Value': self.unit_value,
            'Description': self.description,
            'timestamp': self.timestamp
        }