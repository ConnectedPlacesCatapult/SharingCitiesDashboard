""" Data model class for Users table """

from datetime import datetime

import bcrypt
from sqlalchemy.exc import IntegrityError

from db import db

class Users(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(400), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(400), nullable=False)
    admin = db.Column(db.Boolean)
    activated = db.Column(db.Boolean)
    timestamp = db.Column(db.DateTime)

    def __init__(self, fullname, email, password, admin, activated, timestamp=None):
        self.fullname = fullname
        self.email = email
        self.password = password
        self.admin = admin
        self.activated = activated

        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self):
        return 'Users email is: %s' % self.email

    def __str__(self):
        return self.json()

    def json(self):
        return {
            'id': self.id,
            'fullname': self.fullname,
            'email': self.email,
            'admin': self.admin,
            'activated': self.activated
        }

    def save(self):
        """
        Add the current Users fields to the SQLAlchemy session
        """
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            print(self.fullname, 'User already exists')

    def delete(self):
        """ Add the current Users fields to the SQLAlchemy session to be delete"""
        
        try:
            db.session.delete(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()

    @staticmethod
    def commit():
        """ Commit updated items to the database """
        db.session.commit()

    @classmethod
    def find_by_email(cls, email):
        """ Return the user corresponding to the email argument from the Users table 
            :param email: user's email
            :type email: string
            :return: Users credentials
            :rtype: Users instance
        """

        return cls.query.filter_by(email=email).first()

    @staticmethod
    def generate_hash(password):
        """ Generate a secure hash 
            :param password: user's to be password
            :type password: string
            :return: a hashed version of the password string
            :rtype: unicode encoded string
        """

        return bcrypt.hashpw(password, bcrypt.gensalt())

    @staticmethod
    def verify_hash(password, hash):
        """ Verify password matches the hashed password in the database. 
            :param password: user's to be password
            :param hash: the password hash that would be stored in the database
            :type password: string
            :type hash: string
            :return: whether the password arguement corresponds to the hash
            :rtype: boolean
        """

        return bcrypt.checkpw(password, hash)

