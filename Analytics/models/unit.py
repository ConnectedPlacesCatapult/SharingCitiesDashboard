from db import db
from datetime import datetime

class Unit(db.Model):
    __tablename__ = 'unit'

    id = db.Column(db.Integer, primary_key=True)
    _type = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime)

    _attributes = db.relationship('Attributes', backref='unit', lazy=True)

    def __init__(self, _type, description, timestamp=None):
        self._type = _type
        self.description = description

        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self):
        return 'Unit Type: %s, Description: %s' % (self._type, self.description)

    def json(self):
        return {
            'id': self.id,
            'Type': self._type,
            'Description': self.description,
            'Timestamp': self.timestamp
        }

    def save(self):
        db.session.add(self)
        db.session.flush()

    def get(self):
        return Unit.query.all()