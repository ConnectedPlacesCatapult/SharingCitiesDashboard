import json
import logging
from datetime import datetime
from typing import Union

from sqlalchemy.exc import IntegrityError

from db import db

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class Theme(db.Model):
    """
    Data table to store information about Themes
    """
    __tablename__ = 'theme'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    timestamp = db.Column(db.DateTime)

    subtheme = db.relationship('SubTheme', backref='theme', lazy=True)

    def __init__(self, name: str, timestamp: datetime = None):
        """ Sets the timestamp to the current date and time (UTC +0)"""
        self.name = name
        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self) -> str:
        """ overrides the dunder reper method returning the themes name as a string"""
        return 'Theme name: %s' % self.name

    def __str__(self) -> str:
        """ Overrides dunder str method to return object data as a str"""
        return json.dumps(self.json())

    def json(self) -> {str: Union[str, int]}:
        """Creates a JSON of the theme data"""
        return {
            'id': self.id,
            'Name': self.name
        }

    def save(self) -> None:
        """put object in queue to be committed to database"""
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(self.name, 'theme already exists')

    def delete(self) -> None:
        """put object in queue for deletion from database"""
        try:
            db.session.delete(self)
            # db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(self.name, 'theme does not exists')

    @staticmethod
    def commit() -> None:
        """apply changes to the database"""
        db.session.commit()

    @classmethod
    def get_all(cls) -> [db.Model]:
        """fetches all theme entries from the database and returns them as a list of Theme"""
        return Theme.query.all()

    @classmethod
    def get_by_name(cls, name: str) -> db.Model:
        """Fetches a them instance by name from the database"""
        return cls.query.filter_by(name=name).first()

    @classmethod
    def get_by_id(cls, id: str) -> db.Model:
        """Fetches a them instance by its id from the database"""
        return cls.query.filter_by(id=id).first()


class SubTheme(db.Model):
    """
    Data table to store information about sub themes
    """
    __tablename__ = 'subtheme'

    id = db.Column(db.Integer, primary_key=True)
    t_id = db.Column(db.Integer, db.ForeignKey('theme.id'), nullable=False)
    name = db.Column(db.String(255), unique=True, nullable=False)
    timestamp = db.Column(db.DateTime)

    # attributes = db.relationship('Attributes', backref='subtheme', lazy=True)

    def __init__(self, t_id: int, name: str, timestamp: datetime = None):
        """ Instanciate model and sets timestamp if None to the present utc time"""
        self.t_id = t_id
        self.name = name

        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self) -> str:
        return 'Sub Theme Name: %s' % self.name

    def json(self) -> {str: Union[int, str]}:
        """
        Creates a JSON representation of the sub-theme instance
        :return: The sub themes id, its parent themes id and the name of the sub theme
        """
        return {
            'id': self.id,
            'Theme id': self.t_id,
            'Name': self.name
        }

    def save(self) -> None:
        """put object in queue to be committed to database"""
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(self.name, 'sub theme already exists')

    def delete(self) -> None:
        """put object in queue to be deleted from database"""
        try:
            db.session.delete(self)
            # db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(self.name, 'sub theme does not exists')

    def commit(self) -> None:
        """Commit changes to the database"""
        db.session.commit()

    @classmethod
    def get_all(cls) -> db.Model:
        """Fetches all sub themes from the database"""
        return SubTheme.query.all()

    @classmethod
    def get_by_theme_id(cls, theme_id: int) -> db.Model:
        """Fetches all sub themes according to their parent theme id"""
        return SubTheme.query.filter_by(t_id=theme_id).all()

    @classmethod
    def get_by(cls, **kwargs: {str: Union[str, int, bool, object]}) -> db.Model:
        """ Fetches all sub themes that meet the filter keyword arguments passed"""
        return cls.query.filter_by(**kwargs).first()

    @classmethod
    def get_by_name(cls, name: str) -> db.Model:
        """Fetches a them instance by name from the database"""
        return cls.query.filter_by(name=name).first()
