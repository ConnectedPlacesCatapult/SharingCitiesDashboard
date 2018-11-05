from base import BaseImporter
from datetime import datetime
import os
import json

class CreateImporter(object):
    def __init__(self):
        self.terminal_width = os.get_terminal_size().columns
        
    def builder(self):
        self._print_in_middle('Importer Builder')
        data_source = {}
        questions = Questions()
        for q in dir(questions):
            if not q.startswith('__'):
                t = getattr(questions, q)
                self._questions(t)
                data_source[t] = input()
                
        data_source[self._questions(Questions.API_NAME)] = input()
        # api_name = input()

        data_source[self._questions(Questions.API_URL)] = input()
        # api_url = input()

        data_source[self._questions(Questions.API_REFRESH_TIME)] = input()
        # refresh_time = input()

        data_source[self._questions(Questions.API_KEY)] = input()
        # api_key = input()

        data_source[self._questions(Questions.API_TOKEN_EXPIRY)] = input()
        # token_expiry = input()

        dataset = self.load_dataset(api_name, api_url, refresh_time, api_key, token_expiry)
        self._print_dataset(dataset)

        data_source[self._questions(Questions.SENSOR_TAG_NAME)] = input()
        # sensor_tag_name = input()
        # Before the next step check if the entered tag name exists or not

        data_source[self._questions(Questions.USE_VALUE_OF_TAG_AS_SENSOR_NAME)] = input()
        # use_tag_value = input()

        data_source[self._questions(Questions.SENSOR_LOCATION_TAG_NAMES)] = input()
        # location = input()
        _location = data_source[self._questions(Questions.SENSOR_LOCATION_TAG_NAMES)].split()
        lat = lon = 0.0
        if len(_location) > 1:
            lat, lon = _location

        
        self._print_in_middle('Staging API and Sensor for Commit')
        self._print_in_middle('Summary')

        


    def _questions(self, q, end=''):
        print(Colors.BOLD, Colors.OKGREEN, q, Colors.ENDC, end=end)
        return q

    def load_dataset(self, name, url, refresh_time, api_key, token_expiry):
        b = BaseImporter(name, url, refresh_time, api_key, token_expiry)
        return b.dataset

    def _print_dataset(self, dataset):
        _print = json.dumps(dataset, indent=2)
        count = 0
        to_show = ''
        self._print_in_box()
        for s in _print:
            to_show += s
            if s == '\n':
                count += 1

            if count == 20:
                print(to_show)
                to_show = ''
                count = 0
                self._questions('Would you like to see next 20 lines (Y/N): ')
                _next = input()
                if _next != 'Y' and _next != 'y':
                    break

        self._print_in_box()

    def _print_in_box(self):
        for i in range(self.terminal_width//2):
            print(Colors.OKBLUE , '#', end='')
        print(Colors.ENDC)

    def _print_in_middle(self, v):
        print(Colors.BOLD, Colors.HEADER, v.center(self.terminal_width), Colors.ENDC)


class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class Questions:
    API_NAME = 'Enter API Name: '
    API_URL = 'Enter API URL: '
    API_REFRESH_TIME = 'Enter API Refresh Time in seconds: '
    API_KEY = 'Enter API Key: '
    API_TOKEN_EXPIRY = 'Enter token expiry in Date format e.g DD/MM/YYY HH:MM:SS : '
    SENSOR_TAG_NAME = 'Provide Tag Name for Sensor: '
    USE_VALUE_OF_TAG_AS_SENSOR_NAME = 'Use value of the Tag as Sensor Name: (Y/N) '
    SENSOR_LOCATION_TAG_NAMES = 'Enter tag names for location of Sensor space seperated: '

if __name__ == '__main__':
    c = CreateImporter()
    c.builder()