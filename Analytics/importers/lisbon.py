import json
import logging
import traceback
from typing import Union

import pandas as pd
import requests
from requests.auth import HTTPBasicAuth

from Analytics.settings import GetConfig
from importers.base import BaseImporter
from importers.json_reader import JsonReader
from .state_decorator import ImporterStatus, Status

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


@GetConfig("LisbonAPI", 'api_endpoints', 'lisbon')
class LisbonAPI(BaseImporter):
    """
    LisbonAPI Importer
    """
    importer_status = ImporterStatus.get_importer_status()

    def __init__(self) -> None:
        """
        Get Importer configurations
        Instantiate BaseImporter
        """

        super().__init__(self.API_NAME, self.BASE_URL, self.REFRESH_TIME,
                         self.API_KEY, self.API_CLASS, self.TOKEN_EXPIRY)

    def _create_datasource(self, headers: Union[str, None] = None) -> None:
        """
        Create DataSource
        :param headers: Request headers
        """
        try:
            _headers = {'Authorization': 'Bearer %s' % self._refresh_token()}

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
                logger.error('Nothing to save as dataframe is empty')
            else:
                logger.info(concat_df)
                self.create_datasource(dataframe=concat_df, sensor_tag='',
                                       attribute_tag=[],
                                       unit_value=[], bespoke_unit_tag=[],
                                       description=[],
                                       bespoke_sub_theme=[],
                                       location_tag='loc',
                                       api_timestamp_tag='run_time_stamp')
            self.importer_status.status = Status.success(__class__.__name__)
        except Exception as e:
            self.importer_status.status = Status.failure(__class__.__name__,
                                                         e.__str__(),
                                                         traceback.format_exc())

    def _refresh_token(self) -> str:
        """
        Refresh API Token
        :param args: Variable argument list
        :return: New token
        """
        headers = {"grant_type": "client_credentials"}
        token_url = 'https://iot.alticelabs.com/api/devices/token'
        token = requests.post(token_url, headers=headers,
                              auth=HTTPBasicAuth(self.USER_NAME,
                                                 self.USER_PASSCODE))
        return str(token.text)
