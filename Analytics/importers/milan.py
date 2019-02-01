'''
Milan Importer
The class inherits from BaseImporter and doesn't contain any bespoke code 
apart from converting the data from json to tabular format but using BaseImporter methods

The api doesn't have any credentials and doesn't have any key or token expiry
'''

import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from importers.base import BaseImporter, Location, get_config
from models.sensor import Sensor
from models import location
from datetime import datetime
import json
import pandas as pd

config = get_config()
config = config[config['environment']]['milan']

API_NAME = config['API_NAME']
BASE_URL = config['BASE_URL']
REFRESH_TIME = config['REFRESH_TIME']
API_KEY = config['API_KEY']
TOKEN_EXPIRY = config['TOKEN_EXPIRY']
REFRESH_URL = config['REFRESH_URL']
API_CLASS = config['API_CLASS']

class MilanAPI(BaseImporter):
	def __init__(self):
		super().__init__(API_NAME, BASE_URL, REFRESH_TIME, API_KEY, API_CLASS, TOKEN_EXPIRY)

	def _create_datasource(self, headers=None):
		super()._create_datasource(headers)
		columns = ['device_title', 'device_eui', 'device_description', 
					'driver_type', 'code', 'max_tilt', 'temperature', 'dimmer_perc',
					'dimmer_read', 'dimmer_default', 'dimmer_set', 'datetime', 'do2',
					'firmware_version', 'tilt_angle', 'connected_device', 'energy_delivered',
					'di4', 'di5', 'energy_consumed', 'do1', 'di1', 'di2', 'di3', 'family_id',
					'lat', 'lng', 'device_id']
		self.df = self.create_dataframe(object_separator='device_title')
		self.df = self.df[self.df['device_title'] == 'Lampione']
		self.df = self.df[columns]
		loc = Location('lat', 'lng')
		self.create_datasource(dataframe=self.df, sensor_tag='device_id', 
								attribute_tag=['temperature', 'dimmer_perc',
								'dimmer_read', 'dimmer_default', 'dimmer_set', 'do2',
								'tilt_angle', 'connected_device', 'energy_delivered',
								'di4', 'di5', 'energy_consumed', 'do1', 'di1', 'di2', 'di3'], 
								unit_value=[], bespoke_unit_tag=[], description=['No Description'],
								bespoke_sub_theme=[], location_tag=loc, sensor_prefix='Lampione_', 
								api_timestamp_tag='datetime')
	
	def _refresh_token(self, *args):
		print('Token Expired')


config = get_config()
config = config[config['environment']]['milan_sensori_meteo_meta']

API_NAME_SMM = config['API_NAME']
BASE_URL_SMM = config['BASE_URL']
REFRESH_TIME_SMM = config['REFRESH_TIME']
REFRESH_URL_SMM = config['REFRESH_URL']
API_CLASS_SMM = config['API_CLASS']
HEADERS_SMM = config['HEADERS']


class Milan_API_sensori_meteo_meta(BaseImporter):
    def __init__(self):
        super().__init__(API_NAME_SMM, BASE_URL_SMM, REFRESH_TIME_SMM, API_KEY, API_CLASS_SMM, TOKEN_EXPIRY)

    def _create_datasource(self, headers=json.loads(HEADERS_SMM.replace("'",'"'))):
        super()._create_datasource(headers)

        self.df = self.create_dataframe(object_separator=None)
        self.df['api_timestamp_tag'] = datetime.now().timestamp()
        loc = Location('latitudine', 'longitudine')
        self.create_datasource(dataframe= self.df, sensor_tag='dev_eui', attribute_tag=['dev_eui'], 
                                unit_value=[], bespoke_unit_tag=[], description=['descrizione'], bespoke_sub_theme=[], 
                                location_tag=loc, sensor_prefix='', api_timestamp_tag='api_timestamp_tag',
                                is_dependent=True)


    def _refresh_token(self, *args):
        print('Token Expired')

config = get_config()
config = config[config['environment']]['milan_sensori_meteo']

API_NAME_SM = config['API_NAME']
BASE_URL_SM = config['BASE_URL']
REFRESH_TIME_SM = config['REFRESH_TIME']
REFRESH_URL_SM = config['REFRESH_URL']
API_CLASS_SM = config['API_CLASS']
HEADERS_SM = config['HEADERS']



class Milan_API_sensori_meteo(BaseImporter):
    def __init__(self):
        super().__init__(API_NAME_SM, BASE_URL_SM, REFRESH_TIME_SM, API_KEY, API_CLASS_SM, TOKEN_EXPIRY)

    def _create_datasource(self, headers=json.loads(HEADERS_SM.replace("'",'"'))):
        super()._create_datasource(headers)

        self.df = self.create_dataframe(object_separator=None)
        
        names = self.df['dev_eui'].tolist()
        name_set = set()
        location_sensor = {}
        sensor_location = {}
        sensor_name_location = {}

        latitude = []
        longitude = []

        for s in names:
            name_set.add(str(s))

        sensors = Sensor.get_by_name_in(name_set)
        loc_ids = []
        for s in sensors:
            loc_ids.append(s.l_id)
            location_sensor[s.l_id] = s
            locations = location.Location.get_by_id_in(loc_ids)

        d = dict(zip([n.name for n in sensors], locations))

        self.df['latitude'] = self.df['dev_eui'].apply(lambda x: d.get(x).lat)
        self.df['longitude'] = self.df['dev_eui'].apply(lambda x: d.get(x).lon)
        self.df['api_timestamp_tag'] = pd.to_datetime(self.df['data'])
        self.df['api_timestamp_tag'] = self.df['api_timestamp_tag'].astype(int)

        loc = Location('latitude', 'longitude')

        self.create_datasource(dataframe=self.df, sensor_tag='dev_eui', 
                                attribute_tag=['pressione', 'temperatura',
                                'umidita'], 
                                unit_value=[], bespoke_unit_tag=[], description=['No Description'],
                                bespoke_sub_theme=[], location_tag=loc, sensor_prefix='', 
                                api_timestamp_tag='api_timestamp_tag')

    def _refresh_token(self, *args):
        print('Token Expired')

