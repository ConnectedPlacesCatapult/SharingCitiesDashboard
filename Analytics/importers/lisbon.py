import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from importers.base import BaseImporter
from importers.json_reader import JsonReader
import requests
from requests.auth import HTTPBasicAuth
import json
import pandas as pd
from .state_decorator import ImporterStatus, Status
from .config_decorator import GetConfig


@GetConfig("LisbonAPI")
class LisbonAPI(BaseImporter):
    importer_status = ImporterStatus.get_importer_status()

    def __init__(self):
        self.importer_status.status = Status(__name__, action="__init__")
        self.config = self.get_config('environment', 'lisbon')
        self.USER_NAME = self.config['USER_NAME']
        self.USER_PASSCODE = self.config['USER_PASSCODE']
        super().__init__(self.API_NAME, self.BASE_URL, self.REFRESH_TIME, self.API_KEY, self.API_CLASS,
                         self.TOKEN_EXPIRY)

    def _create_datasource(self, headers=None):
        _headers = {'Authorization': 'Bearer %s' % self._refresh_token()}
        self.importer_status.status = Status(__name__, action="_create_datasource", state="Create DataSource",
                                             headers=_headers)
        super()._create_datasource(_headers)
        self.importer_status.status = Status(__name__, action="_create_datasource", state="Create DataFrame",
                                             object_separator='timeToLive')
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
                                   bespoke_sub_theme=[], location_tag='loc',
                                   api_timestamp_tag='run_time_stamp')

        self.importer_status.status = Status(__name__, action="_create_datasource", state="Done")

    def _refresh_token(self, *args):

        headers = {"grant_type": "client_credentials"}
        token_url = 'https://iot.alticelabs.com/api/devices/token'
        self.importer_status.status = Status(__name__, action="_refresh_token", state="Refresh Token",
                                             token_url=token_url, headers=headers)
        token = requests.post(token_url, headers=headers, auth=HTTPBasicAuth(self.USER_NAME, self.USER_PASSCODE))
        self.importer_status.status = Status(__name__, action="_refresh_token", state="Done", token=token)
        return (str(token.text))
