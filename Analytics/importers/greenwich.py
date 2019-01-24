'''
GreenwichMeta and GreenwichOCC Importer
The file has two importers.

GreenwichOCC is dependent upon GreenwichMeta, thus GreenwichMeta needs to be imported first 
before importing GreenwichOCC.

Both the classes share the same API key.
The classes doesn't have any bespoke code apart from calling urls and converting them into dataframes.
Once that is done it calls the create_datasource method of the base class which saves the sensors, attributes,
location, creates data tables and saves values.
'''

import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from importers.base import BaseImporter, Location, get_config
from models.sensor import Sensor
from models import location
from db import db

config = get_config()
config = config[config['environment']]['greenwich_meta']

API_NAME = config['API_NAME']
BASE_URL = config['BASE_URL']
REFRESH_TIME = config['REFRESH_TIME']
API_KEY = config['API_KEY']
TOKEN_EXPIRY = config['TOKEN_EXPIRY']
REFRESH_URL = config['REFRESH_URL']
API_CLASS = config['API_CLASS']

class GreenwichMeta(BaseImporter):
    def __init__(self):
        super().__init__(API_NAME, BASE_URL, REFRESH_TIME, API_KEY, API_CLASS, TOKEN_EXPIRY)

    def _create_datasource(self, headers=None):
        super()._create_datasource()
        self.df  = self.create_dataframe(ignore_object_tags=['fieldAliases', 'fields'])

        loc = Location('latitude', 'longitude')
        self.create_datasource(dataframe= self.df, sensor_tag='lotcode', attribute_tag=['baycount', 'baytype'], 
                                unit_value=[], bespoke_unit_tag=[], description=[], bespoke_sub_theme=[], 
                                location_tag=loc, sensor_prefix='smart_parking_', api_timestamp_tag='run_time_stamp',
                                is_dependent=True)

    def _refresh_token(self, *args):
        print('Token expired Refresh it manually')


config = get_config()
config = config[config['environment']]['greenwich_occ']

API_NAME_OCC = config['API_NAME']
BASE_URL_OCC = config['BASE_URL']
API_CLASS_OCC = config['API_CLASS']

class GreenwichOCC(BaseImporter):
    def __init__(self):
        super().__init__(API_NAME_OCC, BASE_URL_OCC, REFRESH_TIME, API_KEY, API_CLASS_OCC, TOKEN_EXPIRY)

    def _create_datasource(self, headers=None):
        super()._create_datasource()
        self.df  = self.create_dataframe(ignore_object_tags=['fieldAliases', 'fields'])

        names = self.df['lotcode'].tolist()
        name_set = set()
        location_sensor = {}
        sensor_location = {}
        latitude = []
        longitude = []

        for s in names:
            name_set.add('smart_parking_' + str(s))

        sensors = Sensor.get_by_name_in(name_set)
        loc_ids = []
        for s in sensors:
            loc_ids.append(s.l_id)
            location_sensor[s.l_id] = s
        locations = location.Location.get_by_id_in(loc_ids)

        for loc in locations:
            if loc.id in location_sensor:
                _sensor = location_sensor[loc.id]
                sensor_location[_sensor.name] = loc
       
        for s in names:
            _s = 'smart_parking_' + str(s)
            if _s in sensor_location:
                latitude.append(sensor_location[_s].lat)
                longitude.append(sensor_location[_s].lon)

        self.df['latitude'] = latitude
        self.df['longitude'] = longitude
        loc = Location('latitude', 'longitude')
        self.create_datasource(dataframe= self.df, sensor_tag='lotcode', attribute_tag=['free', 'isoffline', 'occupied'], 
                                unit_value=[], bespoke_unit_tag=[], description=[], bespoke_sub_theme=[], location_tag=loc,
                                sensor_prefix='smart_parking_', api_timestamp_tag='run_time_stamp', is_dependent=True)

    def _refresh_token(self, *args):
        print('Token expired Refresh it manually')

