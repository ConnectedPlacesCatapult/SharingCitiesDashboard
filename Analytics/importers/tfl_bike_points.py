'''
TFL Bike points importer

The importer gets extended from BaseImporter and doesn't have any bespoke code apart from defining the 
structure of the api, like sensor, attributes, data tables and values
'''

import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from importers.base import BaseImporter
import pandas as pd
import numpy as np

from .state_decorator import ImporterStatus, Status
from .config_decorator import GetConfig


@GetConfig("TfL_BikePoints")
class TfL_BikePoints(BaseImporter):
    importer_status = ImporterStatus.get_importer_status()

    def __init__(self):
        self.config = self.get_config('environment', 'tfl_bike_points')
        self.importer_status.status = Status(__name__, action="__init__")
        super().__init__(self.API_NAME, self.BASE_URL, self.REFRESH_TIME, self.API_KEY, self.API_CLASS,
                         self.TOKEN_EXPIRY)

    def _create_datasource(self, headers=None):
        self.importer_status.status = Status(__name__, action="_create_datasource", state="Create DataSource",
                                             headers=headers)
        super()._create_datasource(headers)
        self.importer_status.status = Status(__name__, action="_create_datasource", state="Create DataFrame",
                                             ignore_objects_tags=['$type'], object_separator='id')
        self.df = self.create_dataframe(ignore_object_tags=['$type'], object_separator='id')

        self.df.dropna(inplace=True)

        self.df = self.df[self.df.key == 'NbEmptyDocks']
        self.df['modified'] = self.df.modified.apply(lambda x: pd.to_datetime(x))
        self.df['modified'] = self.df['modified'].astype(np.int64)

        self.create_datasource_with_values(dataframe=self.df, sensor_tag='id', attribute_tag='key',
                                           value_tag='value', latitude_tag='lat', longitude_tag='lon',
                                           description_tag='sourceSystemKey', api_timestamp_tag='modified')
        self.importer_status.status = Status(__name__, action="_create_datasource", state="Done")
