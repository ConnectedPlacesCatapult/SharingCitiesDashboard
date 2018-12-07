import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from importers.base import BaseImporter, Location, get_config
from importers.json_reader import JsonReader
import requests
from requests.auth import HTTPBasicAuth
from models.api import API
import json
import pandas as pd

config = get_config()
config = config[config['environment']]['lisbon']

API_NAME = config['API_NAME']
BASE_URL = config['BASE_URL']
REFRESH_TIME = config['REFRESH_TIME']
API_KEY = config['API_KEY']
TOKEN_EXPIRY = config['TOKEN_EXPIRY']
API_CLASS = config['API_CLASS']
USER_NAME = config['USER_NAME']
USER_PASSCODE = config['USER_PASSCODE']

class LisbonAPI(BaseImporter):
    def __init__(self):
        super().__init__(API_NAME, BASE_URL, REFRESH_TIME, API_KEY, API_CLASS, TOKEN_EXPIRY)

    def _create_datasource(self, headers=None):
        _headers = {'Authorization' : 'Bearer %s' % self._refresh_token()}
        super()._create_datasource(_headers)
        self.df = self.create_dataframe(object_separator='timeToLive')
        self.df = self.df[self.df['streamName'] == 'GiraStation']
        data = self.df['data'].tolist()
        temp_df = None
        for d in data:
            j_reader = JsonReader()
            j_reader.create_objects(json.loads(d))
            _df = j_reader.create_dataframe()
            if temp_df is None:
                temp_df = _df
            else:
                temp_df = temp_df.append(_df, ignore_index=True)

        concat_df = pd.concat([self.df, temp_df], axis=0)
        if concat_df.empty:
            concat_df.to_csv('/Users/hemanshu/Desktop/lisbon_test.csv')
            print('Nothing to save as dataframe is empty')
        else:
            print(concat_df)
            self.create_datasource(dataframe=concat_df, sensor_tag='', attribute_tag=[],
                                unit_value=[], bespoke_unit_tag=[], description=[], 
                                bespoke_sub_theme=[], location_tag=loc,
                                api_timestamp_tag='run_time_stamp')


    def _refresh_token(self, *args):
        headers = {"grant_type" : "client_credentials"}
        token_url = 'https://iot.alticelabs.com/api/devices/token'
        token = requests.post(token_url, headers=headers, auth=HTTPBasicAuth(USER_NAME, USER_PASSCODE))
        return(str(token.text))