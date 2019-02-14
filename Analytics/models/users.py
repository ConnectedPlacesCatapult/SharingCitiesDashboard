import json
from db import db
from datetime import datetime
from sqlalchemy.exc import IntegrityError
import bcrypt


#TODO: add doc string 

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
        return {
            'id': self.id,
            'fullname': self.firstname,
            'email': self.email,
            'admin': self.admin,
            'activated': self.activated
        }

    def save(self):
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            print(self.name, 'User already exists')

    def commit(self):
        db.session.commit()

    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email = email).first()

    @staticmethod
    def generate_hash(password):
        return bcrypt.hashpw(password, bcrypt.gensalt())
    @staticmethod
    def verify_hash(password, hash):
        return bcrypt.checkpw(password, hash)

