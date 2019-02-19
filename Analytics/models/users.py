'''
Data model class for User credentials 
'''

import json
from db import db
from datetime import datetime
from sqlalchemy.exc import IntegrityError
import bcrypt


class Users(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(400), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(400), nullable = False)
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
        """ Returns a JSON representation of Users attributes """
        return {
            'id': self.id,
            'fullname': self.firstname,
            'email': self.email,
            'admin': self.admin,
            'activated': self.activated
        }

    def save(self):
        """ Adds the current values of the Users fields to SQLAlchemy session but does not write to the database """
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            print(self.fullname, 'User already exists')

    def commit(self):
        """ Writes all updates done via db.session.add() or manual update of the model class fields to the database """
        db.session.commit()

    @classmethod
    def find_by_email(cls, email):
        """ Queries the users table according the email attribute
            :param email: the email address of the user that is being looked up
            :type email: string
            :return: a Users instance where the contained attributes correspond to that of the email provided
            :rtype: Instance of Users model class 
        """
        return cls.query.filter_by(email = email).first()

    @staticmethod
    def generate_hash(password):
        """A method that uses the provided password and additional salt in order to generate a hash that is to be stored in the DB
        :param password: the plaintext user password
        :type password: UTF8 encoded string
        :return: a hash of the password. The password has salt appeneded to it before it is hashed
        :rtype: string
        """    
        return bcrypt.hashpw(password, bcrypt.gensalt())
    
    @staticmethod
    def verify_hash(password, hash):
        """A method that verifies whether the password provided matches the corresponding password stored in the database
        
        :param password: the plaintext user password
        :param hash: the user's hashed password that is stored in the user table
        :type password: UTF8 encoded string
        :type password: UTF8 encoded string
        :return: whether the password, when hashed, corresponds to the password hash stored in the users table
        :rtype: boolean
        """
        return bcrypt.checkpw(password, hash)

