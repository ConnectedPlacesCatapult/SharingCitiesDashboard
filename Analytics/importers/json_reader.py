'''
Helper Class
It is a utility class that converts json files into dataframes, which can then be treated as tables 
using pandas library.

The class gives option to ignore certain, tags, values and objects which when provided will not be included 
in the final dataframe.

The class requires an url and object_seperator (name of the tag the marks the start of the next record)
e.g
    {
        "@SpeciesCode": "NO2",
        "@MeasurementDateGMT": "2018-11-30 00:00:00",
        "@Value": "7.8"
    },
    {
        "@SpeciesCode": "NO2",
        "@MeasurementDateGMT": "2018-11-30 01:00:00",
        "@Value": ""
    }
In the example above the object separator is @SpeciesCode
It is a recursive algorithm that doesn't the depth of the json structure and flatens it to a tabular structure
'''

import json

import pandas as pd
import requests

from .state_decorator import ImporterStatus, Status


class JsonReader(object):
    importer_status = ImporterStatus.get_importer_status()

    def __init__(self, url=None, object_seperator: str = None):
        self.importer_status.status = Status(__name__, action="__init__", url=url, object_seperator=object_seperator)
        self.url = url
        self.object_seperator = object_seperator
        self.list_of_objects = []
        self.json_objects = JsonObjects()

    def fetch_data(self):
        self.importer_status.status = Status(__name__, action="fetch_data", state="Request Data", url=self.url)
        try:
            data = requests.get(self.url)
        except Exception as e:
            self.importer_status.status = Status(__name__, action="Exception", url=self.url, exception=e.__str__())
            return
        self.importer_status.status = Status(__name__, action="fetch_data", state="Response Recieved", url=self.url,
                                             status_code=data.status_code)

        try:
            self.importer_status.status = Status(__name__, action="fetch_data", state="Parsing Response Data to JSON",
                                                 url=self.url)
            _json = json.loads(data.text)
        except Exception as e:
            self.importer_status.status = Status(__name__, action="Exception", state="Exception Parsing Data to JSON",
                                                 url=self.url, exception=e)
            return

        self.importer_status.status = Status(__name__, action="fetch_data", state="Response Data Parsed", url=self.url)
        return _json

    def create_objects(self, data, curr_key: str = None, ignore_tags: list = [],
                       ignore_values: list = [], ignore_tag_values: dict = {},
                       ignore_object_tags: list = []):

        self.importer_status.status = Status(__name__, action="create_objects", state='Busy')

        if isinstance(data, dict):
            for key in data:
                if key in ignore_object_tags:
                    continue
                self.create_objects(data[key], key, ignore_tags, ignore_values, ignore_tag_values)
        elif isinstance(data, list):
            for value in data:
                self.create_objects(value, curr_key, ignore_tags, ignore_values, ignore_tag_values)
        else:
            if curr_key == self.object_seperator:
                if self.json_objects.object_dict:
                    self.list_of_objects.append(self.json_objects)
                self.json_objects = JsonObjects()

            if data in ignore_values or curr_key in ignore_tags or (
                    curr_key in ignore_tag_values and ignore_tag_values[curr_key] == data):
                return

            if curr_key in self.json_objects.object_dict:
                self.json_objects.object_dict[curr_key].append(data)
                if len(self.json_objects.object_dict[curr_key]) > self.json_objects.max_count:
                    self.json_objects.max_count = len(self.json_objects.object_dict[curr_key])
            else:
                self.json_objects.object_dict[curr_key] = [data]

        self.importer_status.status = Status(__name__, action="create_objects", state='Done')

    def create_dataframe(self):
        self.importer_status.status = Status(__name__, action="create_dataframe", state='Busy')
        # print("dataframe: list of objects")
        # print(self.list_of_objects)
        if len(self.list_of_objects) == 0:
            self.list_of_objects.append(self.json_objects)
        data_frame = []
        for records in self.list_of_objects:
            for key in records.object_dict:
                if len(records.object_dict[key]) < records.max_count and len(records.object_dict[key]) < 2:
                    records.object_dict[key] = records.object_dict[key] * records.max_count

        for value in self.list_of_objects:
            _df = pd.DataFrame.from_dict(value.object_dict, orient='index')
            data_frame.append(_df)

        df = pd.concat(data_frame, axis=1, sort=False)
        self.importer_status.status = Status(__name__, action="create_dataframe", state='Done')
        return df.T

    def print_to_csv(self, dataframe, filepath):
        dataframe.to_csv(filepath, index=False)


class JsonObjects(object):
    def __init__(self):
        self.object_dict = {}
        self.max_count = 0

    def __repr__(self):
        return str(self.object_dict)

    def __str__(self):
        return str(self.object_dict)
