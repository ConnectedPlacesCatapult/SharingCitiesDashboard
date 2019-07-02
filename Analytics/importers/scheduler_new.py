import importlib
import logging
import sys
import time
from datetime import datetime, timedelta

import sqlalchemy
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.schedulers.background import BackgroundScheduler
from retrying import retry
from sqlalchemy.orm import sessionmaker, scoped_session

sys.path.append('../')

from app import create_app
from importers.state_decorator import ImporterStatus
from models.api import API as Api_Class
from models.importer_status import ImporterStatuses
from models.attributes import Attributes
from models.attribute_range import AttributeRange

from settings import GetConfig

config = GetConfig.configure('postgres')
application = create_app()
logging.basicConfig(level='INFO', filename='importers.log', filemode='a')
logger = logging.getLogger(__name__)

engine = sqlalchemy.create_engine(config['db_uri'])
session = scoped_session(sessionmaker(bind=engine))
jobstore = {
    'sqlalchemy': SQLAlchemyJobStore(url=config['db_uri'])
}
sched = BackgroundScheduler(jobstores=jobstore)
sched.start()


class RetryingException(Exception):
    """
    Exception that is raised when a function that has a retry decorator fails
    """
    pass


class Scheduler(object):
    """ Schedule the execution of importer tasks """

    status_tracker = ImporterStatus.get_importer_status()

    @status_tracker.changed.register
    def status_has_changed(self, status: ImporterStatus):
        """
        Receive the status of an importer and persist it to the Importer
        Status table
        :param status: Status object identifying the
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

            if status.state == "failure" and not importer_status.retrying:
                importer_status.retrying = True
                importer_status.save()
                importer_status.commit()
                try:
                    Scheduler.retry_importer(status.name)
                    logger.info("Exponential retry procedure was "
                                "successful for class {}".format(status.name))
                except RetryingException:
                    logger.info("Exponential retry procedure was "
                                "unsuccessful for class {}".format(status.name))

                importer_status.retrying = False
                importer_status.save()
                importer_status.commit()

    @staticmethod
    @retry(wait_exponential_multiplier=10000, stop_max_delay=100000)
    def retry_importer(importer_class_name: str):
        """
        Retry importer if it has failed at intervals that correspond to a
        exponential back-off procedure
        :param importer_class_name: name of class that implements the importer
        :raise RetryingException: raise if importer retry was unsuccessful
        """
        logger.info("Importer retry for {}".format(importer_class_name))
        retry_class = Api_Class.get_by_api_class(importer_class_name)
        if retry_class:
            api_name = retry_class.name
            class_name = retry_class.api_class
            Scheduler.fetch_data(class_name, api_name)

        result_entry = ImporterStatuses.find_by_name(importer_class_name)
        if result_entry:
            if result_entry.state != "success":
                raise RetryingException
                # raising an exception informs the @retry decorator to retry
                # the function according to it's arguments

    @staticmethod
    def get_apis() -> list:
        """
        Retrieve API details stored in the database
        :return: a list containing the details of APIs
        """

        _api = session.execute('select * from api')
        apis = []
        for api in _api.fetchall():
            api_instance = API(id=api[0],name=api[1], url=api[2],
                               api_key=api[3], api_class=api[4],
                               refresh_time=api[5], token_expiry=api[6],
                               timestamp=api[7])
            apis.append(api_instance)
        return apis

    @staticmethod
    def fetch_data(class_name: str, api_name: str):
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
        logger.info('Starting Importer for {} at:{} '.format
                    (_class, time.strftime('%Y-%m-%d%H:%M:%S')))
        with application.app_context():
            _d_class._create_datasource()

    @staticmethod
    def main_task():
        """
        Schedule the executions for each of the importers at their specified
        refresh time
        """

        interval = 5
        apis = Scheduler.get_apis()
        for api in apis:
            class_name = api.api_class.split('.')[2]
            sched.add_job(Scheduler.fetch_data, 'interval',
                          name='{}'.format(api.name),
                          seconds=api.refresh_time,
                          start_date=datetime.now()+timedelta(
                              minutes=interval),
                          end_date=datetime.now()+timedelta(hours=23),
                          args=[api.api_class, api.name],
                          replace_existing=True, id='{}'.format(class_name),
                          jobstore='sqlalchemy', misfire_grace_time=300)
            interval += interval

    @staticmethod
    def run():
        """ Schedule main_task to execute once a day """
        apis = Scheduler.get_apis()
        for api in apis:
            if not ImporterStatuses.find_by_api_id(api.id):
                class_name = api.api_class.split('.')[2]
                new_entry = ImporterStatuses(api.id, class_name, 'pending',
                                             '', '', False,datetime.now())
                new_entry.save()
                new_entry.commit()

        all_attribute = Attributes.get_all()
        for attribute in all_attribute:
            if not AttributeRange.get_by_attr_id(attribute.id):
                attr_min = Attributes.attribute_min(attribute.table_name)
                attr_max = Attributes.attribute_max(attribute.table_name)
                try:
                    new_range = AttributeRange(attribute.id, attr_min.s_id,
                                               attr_min.value,
                                               attr_min.timestamp,
                                               attr_max.s_id,
                                               attr_max.value,
                                               attr_max.timestamp,
                                               datetime.now())
                except AttributeError:
                    new_range = AttributeRange(attribute.id, None, None,
                                               None, None, None, None,
                                               datetime.now())

                new_range.save()
                new_range.commit()

        sched.add_job(Scheduler.main_task, 'interval',
                      start_date=datetime.now() + timedelta(seconds=5),
                      days=1, name='Primary_Scheduler',replace_existing=True,
                      id='Primary_Scheduler', jobstore='sqlalchemy')

        try:
            # This is here to simulate application activity (which keeps
            # the main thread alive).
            while True:
                time.sleep(2)
        except (KeyboardInterrupt, SystemExit):
            sched.shutdown()


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
