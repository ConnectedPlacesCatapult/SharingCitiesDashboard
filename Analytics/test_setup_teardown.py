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
        application = create_app(
            TESTING=True,
            DATABASE_NAME='test_analytics',
            SECRET_KEY='testing'
        )

        self.db_uri = 'postgresql+psycopg2://%s:%s@%s/' % (application.config['DB_USERNAME'], application.config['DB_PASSWORD'], application.config['DB_HOST'])
        application.config['SQLALCHEMY_DATABASE_URI'] = self.db_uri + application.config['DATABASE_NAME']

        # Creating database engine
        engine = sqlalchemy.create_engine(self.db_uri)
        conn = engine.connect()
        conn.execute('commit')
        
        # Creating test database
        # conn.execute('create database ' + application.config['DATABASE_NAME'])
        # conn.execute('use ' + application.config['DATABASE_NAME'])

        # Creating all required tables
        db.create_all(app=application)

        # Inserting data into operation table required to validate requests
        conn.execute("insert into operation values (1, 'regression', now());")
        conn.execute("insert into operation values (2, 'classification', now());")
        conn.execute("insert into operation values (3, 'clustering', now());")

        # Closing the test connection
        conn.close()

        # Creating testclient and returning it
        self.appl = application.test_client()
        self.app = application
        return self.appl

    def tearDown(self):
        db.session.remove()
        engine = sqlalchemy.create_engine(self.db_uri)
        conn = engine.connect()
        conn.execute('commit')
        conn.execute('drop database ' + self.app.config['DATABASE_NAME'])
        conn.close()