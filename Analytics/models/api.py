'''
Data class for storing information about API
'''
from db import db
from datetime import datetime
from sqlalchemy.exc import IntegrityError

class API(db.Model):
    __tablename__ = 'api'
    # __bind_key__ = 'backend'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    url = db.Column(db.Text, nullable=False, unique=True)
    api_key = db.Column(db.Text, nullable=False)
    api_class = db.Column(db.Text, nullable=False)
    refresh_time = db.Column(db.Integer)
    token_expiry = db.Column(db.DateTime)
    timestamp = db.Column(db.DateTime)

    devices = db.relationship('Sensor', backref='api', lazy=True)

    def __init__(self, name, url, api_key, api_class, refresh_time, token_expiry, timestamp=None):
        self.name = name
        self.url = url
        self.api_key = api_key
        self.api_class = api_class
        self.refresh_time = refresh_time
        self.token_expiry = token_expiry
        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self):
        return 'Name: %s, Url: %s' % (self.name, self.url)

    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'url': self.url,
            'api key': self.api_key,
            'api class': self.api_class,
            'refresh time': self.refresh_time,
            'token expiry': self.token_expiry,
            'timestamp': self.timestamp
        }

    def save(self):
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError:
            db.session.rollback()
            print('API with %s name already exists' % self.name)
            return API.get_by_name(self.name)

        return self

    def get(self):
        return API.query.filter_by(name=self.name, url=self.url).first()

    @classmethod
    def get_by_name(cls, name):
        return API.query.filter_by(name=name).first()

    @classmethod
    def get_all(cls):
        return API.query.all()