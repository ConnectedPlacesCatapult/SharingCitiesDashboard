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
        """ Set the timestamp to the current date and time (UTC +0)"""
        self.name = name
        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self) -> str:
        """ override the dunder reper method returning the themes name as a string"""
        return 'Theme name: %s' % self.name

    def __str__(self) -> str:
        """ Override dunder str method to return object data as a str"""
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
        """fetch all Themes"""
        return Theme.query.all()

    @classmethod
    def get_by_name(cls, name: str) -> db.Model:
        """Fetch Theme instance by name"""
        return cls.query.filter_by(name=name).first()

    @classmethod
    def get_by_id(cls, id: str) -> db.Model:
        """Fetch Theme by ide"""
        return cls.query.filter_by(id=id).first()


class SubTheme(db.Model):
    """
    Data table to store information about sub themes
    """
    __tablename__ = 'subtheme'

    id = db.Column(db.Integer, primary_key=True)
    t_id = db.Column(db.Integer, db.ForeignKey('theme.id'), nullable=False)
    name = db.Column(db.String(255), unique=False, nullable=False)
    timestamp = db.Column(db.DateTime)

    # attributes = db.relationship('Attributes', backref='subtheme', lazy=True)

    def __init__(self, t_id: int, name: str, timestamp: datetime = None):
        """ Instantiate model and set timestamp if None set to utc +0"""
        self.t_id = t_id
        self.name = name

        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self) -> str:
        return 'Sub Theme Name: %s' % self.name

    def json(self) -> {str: Union[int, str]}:
        """
        Create a JSON representation of the SubTheme
        :return: The SubTheme id, The parent Theme id and the SubTheme name
        """
        return {
            'id': self.id,
            'Theme id': self.t_id,
            'Name': self.name
        }

    def save(self) -> None:
        """Put object in queue to be committed to database"""
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(self.name, 'sub theme already exists')

    def delete(self) -> None:
        """Put object in queue to be deleted from database"""
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
        """Fetch all SubThemes"""
        return SubTheme.query.all()

    @classmethod
    def get_by_theme_id(cls, theme_id: int) -> db.Model:
        """Fetch all SubThemes by parent Theme id"""
        return SubTheme.query.filter_by(t_id=theme_id).all()

    @classmethod
    def get_by(cls, **kwargs: {str: Union[str, int, bool, object]}) -> db.Model:
        """ Fetch all SubThemes by passed filter keyword arguments"""
        return cls.query.filter_by(**kwargs).first()

    @classmethod
    def get_by_name(cls, name: str) -> db.Model:
        """Fetch Theme by name """
        return cls.query.filter_by(name=name).first()
