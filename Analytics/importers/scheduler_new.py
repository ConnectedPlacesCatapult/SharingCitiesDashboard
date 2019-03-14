import os, sys
from datetime import datetime, timedelta
import time
import importlib
import logging

import sqlalchemy
from sqlalchemy.orm import sessionmaker, scoped_session
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.executors.pool import ProcessPoolExecutor, ThreadPoolExecutor

import settings
from importers.state_decorator import ImporterStatus
from models.importer_status import ImporterStatuses
from app import create_app
from db import db

application = create_app()
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
logging.basicConfig(level='INFO', filename='importers.log', filemode='a')
logger = logging.getLogger(__name__)


class Scheduler(object):
    """ Schedule the execution importer tasks """

    status_tracker = ImporterStatus.get_importer_status()

    def __init__(self):
        """ Create SQLAlchemy session and launch APScheduler """

        self.engine = sqlalchemy.create_engine(settings.DB_URI)
        self.session = scoped_session(sessionmaker(bind=self.engine))

        executor = {
            'default': ThreadPoolExecutor(10),
            'processpool': ProcessPoolExecutor(5)
        }
        self.scheduler = BackgroundScheduler(executors=executor)
        self.scheduler.start()

    @status_tracker.changed.register
    def status_has_changed(self, status: ImporterStatuses):
        """
        Receive the status of an importer and persist it to the Importer
        Status table
        :param status: Status object identifying the
        :return:
        """
        logger.info(status)
        importer_status = ImporterStatuses.find_by_name(status.name)
        if importer_status:
            if status.state == "success":
                importer_status.state = "success"
            else:
                importer_status.state = "failure"
                importer_status.reason = status.reason
                importer_status.trace = status.stack_trace

            importer_status.timestamp = datetime.now()
            importer_status.commit()

    def get_apis(self) -> list:
        """
        Retrieve API details stored in the database
        :return: a list containing the details of APIs
        """

        _api = self.session.execute('select * from api')
        apis = []
        for api in _api.fetchall():
            api_instance = API(id=api[0],name=api[1], url=api[2],
                               api_key=api[3], api_class=api[4],
                               refresh_time=api[5], token_expiry=api[6],
                               timestamp=api[7])
            apis.append(api_instance)
        return apis

    def fetch_data(self, class_name: str, api_name: str):
        """
        Import sensor data from the specified API endpoint
        :param class_name: name of the class that implements the
        corresponding importer
        :param api_name: identifying name stored in the database for the
                         respective importer
        """
        _module, _class = class_name.rsplit('.', 1)
        data_class = getattr(importlib.import_module(_module), _class)
        _d_class = data_class()
        logger.info('Starting Importer for {} at:{} '.format(_class,
                                                             time.strftime(
                                                                 '%Y-%m-%d%H:%M:%S')))
        _d_class._create_datasource()

    def main_task(self):
        """
        Schedule the executions for each of the importers at their specified
        refresh time
        """

        apis = self.get_apis()
        for api in apis:
            self.scheduler.add_job(self.fetch_data, 'interval',
                                   name='{}'.format(api.name),
                                   seconds=api.refresh_time,
                                   start_date=datetime.now()+timedelta(seconds=5),
                                   end_date=datetime.now()+timedelta(hours=23),
                                   args=[api.api_class, api.name])

    def run(self):
        """ Schedule main_task to execute once a day """

        apis = self.get_apis()
        for api in apis:
            if not ImporterStatuses.find_by_api_id(api.id):
                class_name = api.api_class.split('.')[2]
                new_entry = ImporterStatuses(api.id, class_name, 'pending',
                                             '', '', datetime.now())
                new_entry.save()
                new_entry.commit()

        self.scheduler.add_job(self.main_task, 'interval',
                               start_date=datetime.now() + timedelta(
                                   seconds=5), days=1,
                               name='Primary_Scheduler')

        try:
            # This is here to simulate application activity (which keeps
            # the main thread alive).
            while True:
                time.sleep(2)
        except (KeyboardInterrupt, SystemExit):
            self.scheduler.shutdown()


class API(object):
    def __init__(self, id: int, name: str, url: str, api_key: str,
                 api_class:str, refresh_time: str, token_expiry: datetime,
                 timestamp: datetime):
        """
        Store fields of api table in a class
        :param id: unique identifier of importer
        :param name: name of the importer
        :param url: API endpoint for accessing data to import
        :param api_key: key which authorises access to the API endpoint
        :param api_class: name of the class which implements the importer
        :param refresh_time: number of seconds to wait until running the
                             importer again
        :param token_expiry: date and time when the api_key will expire
        :param timestamp: date and time when the API details were stored
        """
        self.id = id
        self.name = name
        self.url = url
        self.api_key = api_key
        self.api_class = api_class
        self.refresh_time = refresh_time
        self.token_expiry = token_expiry
        self.timestamp = timestamp


if __name__ == '__main__':
    scheduler = Scheduler()
    scheduler.run()
