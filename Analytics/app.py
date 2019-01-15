from flask import Flask
from flask_restful import Api, reqparse
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from resources.analytics import Analytics
from resources.request_for_data import RequestForData

from db import db
from flask_cors import CORS
from os import environ
from celery import Celery
from celery.result import AsyncResult

app = Flask(__name__)

SECRET_KEY = 'Use-your-secret-key'
DEBUG=True
DB_USERNAME = 'sharingcities'
DB_PASSWORD = ''
DATABASE_NAME = 'test_backend'
DB_HOST = '172.16.2.123'
DB_URI = "postgresql+psycopg2://%s:%s@%s/%s" % (DB_USERNAME, DB_PASSWORD, DB_HOST, DATABASE_NAME)
SQLALCHEMY_DATABASE_URI = DB_URI
SQLALCHEMY_TRACK_MODIFICATIONS = False

app.config['SECRET_KEY'] = SECRET_KEY
app.config['DEBUG'] = DEBUG
app.config['DB_USERNAME'] = DB_USERNAME
app.config['DB_PASSWORD'] = DB_PASSWORD
app.config['DB_HOST'] = DB_HOST
app.config['DB_URI'] = DB_URI
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

cors = CORS(app, resources={r"/*": {"origins":"*"}})
api = Api(app)

db.init_app(app)
db.app = app

# Configs
REDIS_HOST = "0.0.0.0"
REDIS_PORT = 6379
REDIS_PORT_BACKEND = 11211
BROKER_URL = environ.get('REDIS_URL', "redis://{host}:{port}/0".format(
    host=REDIS_HOST, port=str(REDIS_PORT)))
CELERY_RESULT_BACKEND = environ.get('REDIS_URL', "redis://{host}:{port}/0".format(
    host=REDIS_HOST, port=str(REDIS_PORT_BACKEND)))

# Initialize Celery
celery = Celery(app.name, broker = BROKER_URL, backend = BROKER_URL)
celery.conf.update(app.config)



@celery.task
def add_together(a, b):
    return a + b


def create_app(app=app):
    from models.operation import Operation
    from models.request_analytics import RequestAnalytics
    from models.request_table_cols import RequestTablesCols
    from models.request_tables import RequestTables
    from models.api import API
    from models.attributes import Attributes
    from models.sensor import Sensor
    from models.location import Location
    from models.unit import Unit
    from models.sensor_attribute import SensorAttribute 
    from models.theme import Theme, SubTheme

    db.create_all()

    migrate = Migrate(app, db)
    api.add_resource(Analytics, '/analytics')
    api.add_resource(RequestForData, '/data')

    return app

@app.route('/longtask', methods=['GET'])
def longtask():
    result = add_together.delay(23, 42)
    return result.id

@app.route('/retrieve', methods=['GET'])
def retrieve():
    parser = reqparse.RequestParser()
    parser.add_argument('request_id', type=str, store_missing=False)

    args = parser.parse_args()
    request_id = None

    if 'request_id' in args:
        print('here')
        res = celery.AsyncResult(args['request_id'])
        print( res.status)
    
    return str(res.get())


