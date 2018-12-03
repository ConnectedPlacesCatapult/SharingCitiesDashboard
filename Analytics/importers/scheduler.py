import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import multiprocessing, importlib
from multiprocessing import Process
from time import sleep
import sqlalchemy
from sqlalchemy.orm import sessionmaker, scoped_session
import settings


class Scheduler(object):
    def __init__(self):
        self.engine = sqlalchemy.create_engine(settings.DB_URI)
        _session = scoped_session(sessionmaker(bind=self.engine))
        self.session = _session

    def get_api(self):
        apis = self.get_apis()
        processes = {}

        while True:
            counter = 0
            for api in apis:
                if (api.name in processes and not processes[api.name].is_alive()) or api.name not in processes:
                    print('Started process for: ', api.name)
                    if api.name in processes:
                        processes.pop(api.name)

                    # api.refresh_time
                    p = Process(target=self.crawl_datasource, args=(api.url + api.api_key, api.api_class, api.refresh_time, api.name))
                    processes[api.name] = p
                    p.start()

                    counter += 1
            
            if counter == 0:
                print('All processes running....No new Importer')
            else:
                print('Started %d new process' % counter)
                
            print('Main Process awaits to check for new importers.....')
            sleep(86400)
        
    def crawl_datasource(self, url, class_name, time_interval, api_name):
        while True:
            p = Process(target=self.fetch_data, args=(url, class_name, api_name))
            p.start()
            p.join()
        
            sleep(int(time_interval))
    
    def fetch_data(self, url, class_name, api_name):
        import sys, os
        from pathlib import Path
        import time
        _time = time.strftime('%Y-%m-%d')
        log_file = str(Path.home()) + '/sharingcities_logs/' + api_name + '/' + class_name + '_' + _time + '.log'
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

    def get_apis(self):
        _api = self.session.execute('select * from api')
        apis = []
        for api in _api.fetchall():
            a = API(name=api[1], url=api[2], api_key=api[3], api_class=api[4], 
                    refresh_time=api[5], token_expiry=api[6], timestamp=api[7])
            apis.append(a)
        return apis

class API(object):
    def __init__(self, name, url, api_key, api_class, refresh_time, token_expiry, timestamp):
        self.name = name
        self.url = url
        self.api_key = api_key
        self.api_class = api_class
        self.refresh_time = refresh_time
        self.token_expiry = token_expiry
        self.timestamp = timestamp


if __name__ == '__main__':
    s = Scheduler()
    s.get_api()
