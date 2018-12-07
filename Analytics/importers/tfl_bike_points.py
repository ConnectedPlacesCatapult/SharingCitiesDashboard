'''
TFL Bike points importer

The importer gets extended from BaseImporter and doesn't have any bespoke code apart from defining the 
structure of the api, like sensor, attributes, data tables and values
'''

import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from importers.base import BaseImporter, Location, get_config
from models.sensor import Sensor
from models import location
import pandas as pd
import numpy as np

import yaml


config = get_config()
config = config[config['environment']]['tfl_bike_points']

API_NAME = config['API_NAME']
BASE_URL = config['BASE_URL']
REFRESH_TIME = config['REFRESH_TIME']
API_KEY = config['API_KEY']
TOKEN_EXPIRY = config['TOKEN_EXPIRY']
REFRESH_URL = config['REFRESH_URL']
API_CLASS = config['API_CLASS']

class TfL_BikePoints(BaseImporter):
    def __init__(self):
        super().__init__(API_NAME, BASE_URL, REFRESH_TIME, API_KEY, API_CLASS, TOKEN_EXPIRY)

    def _create_datasource(self, headers=None):
        super()._create_datasource()
        self.df  = self.create_dataframe(ignore_object_tags=['$type'], object_separator = 'id')
        
        self.df.dropna(inplace=True)
        
        self.df = self.df[self.df.key == 'NbEmptyDocks']
        self.df['modified'] = self.df.modified.apply(lambda x: pd.to_datetime(x))
        self.df['modified'] = self.df['modified'].astype(np.int64)

        self.create_datasource_with_values(dataframe=self.df, sensor_tag='id', attribute_tag='key', 
                                            value_tag='value', latitude_tag='lat', longitude_tag='lon',
                                            description_tag='sourceSystemKey', api_timestamp_tag='modified')

