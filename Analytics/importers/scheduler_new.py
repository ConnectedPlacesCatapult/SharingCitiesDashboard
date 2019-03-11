import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import multiprocessing, importlib
from multiprocessing import Process
import sqlalchemy
from sqlalchemy.orm import sessionmaker, scoped_session
from apscheduler.schedulers.background import BackgroundScheduler

import settings


class Scheduler(object):

    def __init__(self):
        self.engine = sqlalchemy.create_engine(settings.DB_URI)
        _session = scoped_session(sessionmaker(bind=self.engine))
        self.session = _session

        self.scheduler = BackgroundScheduler()
        self.scheduler.start()

    def get_apis(self):
        _api = self.session.execute('select * from api')
        apis = []
        for api in _api.fetchall():
            a = API(name=api[1], url=api[2], api_key=api[3],
                    api_class=api[4],
                    refresh_time=api[5], token_expiry=api[6],
                    timestamp=api[7])
            apis.append(a)
        return apis

    def fetch_data(self, class_name, api_name):
        import sys, os
        from pathlib import Path
        import time
        _time = time.strftime('%Y-%m-%d')
        log_file = str(
            Path.home()) + '/sharingcities_logs/' + api_name + '/' + class_name + '_' + _time + '.log'
        os.makedirs(os.path.dirname(log_file), exist_ok=True)
        sys.stdout = open(log_file, 'a+')

        from app import create_app
        from db import db
        a = create_app()
        print('\n\n======================================================')
        print(multiprocessing.current_process())
        print('Starting Process at: ', time.strftime('%Y-%m-%d %H:%M:%S'))
        _module, _class = class_name.rsplit('.', 1)
        data_class = getattr(importlib.import_module(_module), _class)
        _d_class = data_class()
        print('Processing Class', _class)
        _d_class._create_datasource()
        del a
        del db
        print('==========================================================')

    def main_task(self):
        print("In main task")
        apis = self.get_apis()
        for api in apis[:1]:
            print('Created job for: ', api.name)
            self.scheduler.add_job(self.fetch_data, 'interval',
                                   seconds=api.refresh_time,
                                   args=[api.api_class, api.name])
    @staticmethod
    def say_hi():
        print("Hi")

    def run(self):
        self.scheduler.add_job(self.main_task, 'interval', days=1)
        print("Added main job")
        while True:
            pass


class API(object):
    def __init__(self, name, url, api_key, api_class, refresh_time,
                 token_expiry, timestamp):
        self.name = name
        self.url = url
        self.api_key = api_key
        self.api_class = api_class
        self.refresh_time = refresh_time
        self.token_expiry = token_expiry
        self.timestamp = timestamp


if __name__ == '__main__':
    s = Scheduler()
    s.run()
