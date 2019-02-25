from datetime import datetime
from typing import NoReturn
import json

import bcrypt
from sqlalchemy.exc import IntegrityError
import logging

from db import db

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)

class Users(db.Model):
    
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(400), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(400), nullable=False)
    admin = db.Column(db.Boolean)
    activated = db.Column(db.Boolean)
    timestamp = db.Column(db.DateTime)

    def __init__(self, fullname: str, email: str, password: str, admin: bool, activated: bool,
                 timestamp: datetime = None):
        """
        Initialises the Users object instance
        :param fullname:    users full name
        :param email:       users email address
        :param password:    plain text password
        :param admin:       true if the user is a admin, false if the user is not an admin
        :param activated:   true if the account has been activated and false if it is not activated
        :param timestamp:   time stamp of when the user was created

        """
        self.fullname = fullname
        self.email = email
        self.password = password
        self.admin = admin
        self.activated = activated

        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self) -> str:
        """
        overrides the dunder repr method
        :return: the users email address
        """
        return 'Users email is: %s' % self.email

    def __str__(self) -> str:
        """
        overrides the dunder string method to cast user to a string
        :return: a JSON string of the Users objects attributes
        """
        return json.dumps(self.json())

    def json(self) -> dict:
        """
        Create a JSON dict of the User objects attributes
        :return: the User objects attributes as a JSON (dict)
        """
        return {
            'id': self.id,
            'fullname': self.fullname,
            'email': self.email,
            'admin': self.admin,
            'activated': self.activated
        }

    def save(self) -> NoReturn:
        """
        Add the current Users fields to the SQLAlchemy session
        """
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(self.fullname + ' User already exists')

    def delete(self) -> NoReturn:
        """
        Add the current Users fields to the SQLAlchemy session to be delete
        """
        try:
            db.session.delete(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(self.fullname + ' User does not exists')

    @staticmethod
    def commit() -> NoReturn:
        """ Commit updated items to the database """
        db.session.commit()

    @classmethod
    def find_by_email(cls, email: str) -> db.Model:
        """
        Return the user corresponding to the email argument from the Users table
        """
        return cls.query.filter_by(email=email).first()

    @staticmethod
    def generate_hash(password: str) -> bytes:
        """ Generate a secure hash """
        
        return bcrypt.hashpw(password, bcrypt.gensalt())

    @staticmethod
    def verify_hash(password: str, hash: bytes) -> bool:
        """ Verify password matches the hashed password in the database."""
        
        return bcrypt.checkpw(password, hash)
