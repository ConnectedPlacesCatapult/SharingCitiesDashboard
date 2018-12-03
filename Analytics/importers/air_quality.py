import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from importers.base import BaseImporter, Location, get_config
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from importers.json_reader import JsonReader
import time

config = get_config()
config = config[config['environment']]['air_quality']

API_NAME = config['API_NAME']
BASE_URL = config['BASE_URL']
REFRESH_TIME = config['REFRESH_TIME']
API_KEY = config['API_KEY']
TOKEN_EXPIRY = config['TOKEN_EXPIRY']
API_CLASS = config['API_CLASS']

class KCLAirQuality(BaseImporter):
	def __init__(self):
		super().__init__(API_NAME, BASE_URL, REFRESH_TIME, API_KEY, API_CLASS, TOKEN_EXPIRY)

	def _create_datasource(self):
		# Get SiteCodes and Location
		url = 'http://api.erg.kcl.ac.uk/AirQuality/Annual/MonitoringObjective/GroupName=London/Year=2010/Json'
		j_reader = JsonReader(url=url, object_seperator='@SiteCode')
		_data = j_reader.fetch_data()
		j_reader.create_objects(data=_data, 
								ignore_tags=['@SiteName', '@SiteType', '@SiteLink', '@DataOwner', 
											'@DataManager', '@LatitudeWGS84', '@LongitudeWGS84',
											'@SpeciesCode', '@SpeciesDescription', '@Year', 
											'@ObjectiveName', '@Value', '@Achieved'])
		_code_df = j_reader.create_dataframe()
		_codes = _code_df['@SiteCode'].tolist()
		_lat = _code_df['@Latitude'].tolist()
		_lon = _code_df['@Longitude'].tolist()
		_codes_location = {}
		for i in range(len(_codes)):
			_codes_location[_codes[i]] = [_lat[i], _lon[i]]
		
		# Fetching day data
		_date = datetime.utcnow()
		_today = _date.strftime('%d.%m.%Y')
		_tomorrow = (_date + timedelta(days=1)).strftime('%d.%m.%Y')
		self.df = None
		for code in _codes:
			self.url = BASE_URL % (code, _today, _tomorrow)
			super()._create_datasource()
			_df = self.create_dataframe(object_separator='@SpeciesCode')
			_dates = _df['@MeasurementDateGMT'].tolist()
			_new_dates = []
			for d in _dates:
				if d is None or d is '' or d is np.nan:
					_new_dates.append(np.nan)
					continue
				s = time.mktime(datetime.strptime(str(d), '%Y-%m-%d %H:%M:%S').timetuple())
				_new_dates.append(str(s))
			rows = len(_df.index)
			_s_code = [code] * rows
			_s_lat = [_codes_location[code][0]] * rows
			_s_lon = [_codes_location[code][1]] * rows
			_df['@SiteCode'] = _s_code
			_df['@Latitude'] = _s_lat
			_df['@Longitude'] = _s_lon
			_df['@Description'] = ['No Description'] * rows
			_df['@MeasurementDateGMT'] = _new_dates
			_df.replace('', np.nan, inplace=True)
			_df.dropna(inplace=True)
			if self.df is None:
				self.df = _df
			else:
				self.df = self.df.append(_df, ignore_index=True)
		
		self.create_datasource_with_values(dataframe=self.df, sensor_tag='@SiteCode', attribute_tag='@SpeciesCode', 
											value_tag='@Value', latitude_tag='@Latitude', longitude_tag='@Longitude',
											description_tag='@Description', api_timestamp_tag='@MeasurementDateGMT')
        