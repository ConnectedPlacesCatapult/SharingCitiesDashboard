'''
Data class for storing information about API
'''
import json

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

    def __init__(self, name: str, url: str, api_key: str, api_class: str,
                 refresh_time: int, token_expiry: datetime, timestamp:
            datetime =datetime.now()):
        """
        Initialise the attributes of the API model
        :param name: name of the API
        :param url: endpoint from which data is imported
        :param api_key: key that allows access to endpoint that url represents
        :param api_class: class that implements the importer
        :param refresh_time: number of seconds between importer execution
        :param token_expiry: date and time when api_key expires
        :param timestamp: date and time when the API entry was persisted
        """
        self.name = name
        self.url = url
        self.api_key = api_key
        self.api_class = api_class
        self.refresh_time = refresh_time
        self.token_expiry = token_expiry
        self.timestamp = timestamp

    def __repr__(self) -> str:
        """
        Override the dunder repr method to cast the name and url attributes
        of the current API instance to a string
        """
        return 'Name: %s, Url: %s' % (self.name, self.url)

    def __str__(self) -> str:
        """
        overrides the dunder string method to cast API attributes to a string
        :return: a JSON string of the API objects attributes
        """
        return json.dumps(self.json())

    def json(self) -> dict:
        """
        Create a JSON dict of the API object attributes
        :return: the API object attributes as a JSON (dict)
        """
        return {
            'id': self.id,
            'name': self.name,
            'url': self.url,
            'api key': self.api_key,
            'api class': self.api_class,
            'refresh time': self.refresh_time,
            'token expiry': str(self.token_expiry),
            'timestamp': str(self.timestamp)
        }

    def save(self) -> db.Model:
        """
        Add the current API fields to the SQLAlchemy session
        """
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError:
            db.session.rollback()
            print('API with %s name already exists' % self.name)
            return API.get_by_name(self.name)

        return self

    def get(self) -> db.Model:
        """
        Return the API table entry which matches the current instance
        """
        return API.query.filter_by(name=self.name, url=self.url).first()

    @classmethod
    def get_by_name(cls, name: str) -> db.Model:
        """
        Return an entry in the API table whose name field matches the name
        argument
        :param name: name of the API table entry
        """
        return API.query.filter_by(name=name).first()

    @classmethod
    def get_by_api_id(cls, id: int) -> db.Model:
        """
        Return an entry whose api id matches the id argument
        :param id: the api id
        """
        return API.query.filter_by(id=id).first()

    @classmethod
    def get_all(cls) -> db.Model:
        """ Return all entries in API table """
        return API.query.all()
