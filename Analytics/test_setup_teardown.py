import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import sqlalchemy
from flask_sqlalchemy import SQLAlchemy
from db import db
from app import create_app

class SetupTearDown(object):
    def __init__(self):
        pass

    def setUp(self):
        # Initialising test application
        application = create_app()

        # Creating testclient and returning it
        self.appl = application.test_client()
        self.app = application
        return self.appl

    def tearDown(self):
        db.session.remove()
        