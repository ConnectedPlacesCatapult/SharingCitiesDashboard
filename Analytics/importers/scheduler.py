from models.api import API
import multiprocessing, importlib
from multiprocessing import Process
from time import sleep

class Scheduler(object):
    def __init__(self):
        pass

    def get_api(self):
        apis = API.get_all()
        processes = {}

        while True:
            counter = 0
            for api in apis:
                if (api.name in processes and not processes[api.name].is_alive()) or api.name not in processes:
                    if api.name in processes:
                        processes.pop(api.name)

                    p = Process(target=self.crawl_datasource, args=(api.url + api.api_key, api.api_class, api.refresh_time))
                    processes[api.name] = p
                    p.start()
                    counter += 1
            
            if counter == 0:
                print('All processes running....No new Importer')
            else:
                print('Started %d new process' % counter)
            
            # No need to join the different processes as they all have their own sleep times
            # for pro in processes.values():
            #     pro.join()
            #     print('is alive', pro.is_alive())
            print('Waiting.....')
            sleep(10)
        
    def crawl_datasource(self, url, class_name, time_interval):

        while True:
            print(multiprocessing.current_process())
            _module, _class = class_name.rsplit('.', 1)
            data_class = getattr(importlib.import_module(_module), _class)
            _d_class = data_class()
            _d_class._create_datasource()
            sleep(time_interval)