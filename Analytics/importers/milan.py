import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from importers.base import BaseImporter, Location, get_config
from models.sensor import Sensor
from models import location

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

	def _create_datasource(self):
		super()._create_datasource()
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
								unit_value=[], bespoke_unit_tag=[], description=['device_description'],
								bespoke_sub_theme=[], location_tag=loc, sensor_prefix='Lampione_', 
								api_timestamp_tag='datetime')
	
	def _refresh_token(self, *args):
		print('Token Expired')

