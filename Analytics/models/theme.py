import json
from db import db
from datetime import datetime
from sqlalchemy.exc import IntegrityError

class Theme(db.Model):
    __tablename__ = 'theme'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    timestamp = db.Column(db.DateTime)

    subtheme = db.relationship('SubTheme', backref='theme', lazy=True)

    def __init__(self, name, timestamp=None):
        self.name = name
        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self):
        return 'Theme name: %s' % self.name

    def __str__(self):
        return self.json()

    def json(self):
        return {
            'id': self.id,
            'Name': self.name
        }

    def save(self):
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            print(self.name, 'theme already exists')

    def commit(self):
        db.session.commit()

    @classmethod
    def get_all(self):
        return Theme.query.all()


class SubTheme(db.Model):
    __tablename__ = 'subtheme'

    id = db.Column(db.Integer, primary_key=True)
    t_id = db.Column(db.Integer, db.ForeignKey('theme.id'), nullable=False)
    name = db.Column(db.String(255), unique=True, nullable=False)
    timestamp = db.Column(db.DateTime)

    # attributes = db.relationship('Attributes', backref='subtheme', lazy=True)

    def __init__(self, t_id, name, timestamp=None):
        self.t_id = t_id
        self.name = name

        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self):
        return 'Sub Theme Name: %s' % self.name

    def json(self):
        return {
            'id': self.id,
            'Theme id': self.t_id,
            'Name': self.name
        }
    
    def save(self):
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            print(self.name, 'sub theme already exists')

    def commit(self):
        db.session.commit()

    @classmethod
    def get_all(cls):
        return SubTheme.query.all()

    @classmethod
    def get_by_theme_id(cls, theme_id):
        return SubTheme.query.filter_by(t_id=theme_id).all()
        
        