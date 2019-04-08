import traceback
from typing import Union

import numpy as np
import pandas as pd

from importers.base import BaseImporter
from Analytics.settings import GetConfig
from .state_decorator import ImporterStatus, Status


@GetConfig("TfL_BikePoints", 'api_endpoints', 'tfl_bike_points')
class TfL_BikePoints(BaseImporter):
    """
    TFL Bike points importer
    The importer gets extended from BaseImporter and doesn't have any bespoke
    code apart from defining the structure of the api, like sensor, attributes,
    data tables and values
    """
    importer_status = ImporterStatus.get_importer_status()

    def __init__(self) -> None:
        """
        Get Import Config
        Instantiate BaseImporter
        """

        super().__init__(self.API_NAME, self.BASE_URL, self.REFRESH_TIME,
                         self.API_KEY, self.API_CLASS, self.TOKEN_EXPIRY)

    def _create_datasource(self, headers: Union[str, None] = None) -> None:
        """
        Create DataSource
        :param headers: Request Headers
        """
        try:
            super()._create_datasource(headers)
            self.df = self.create_dataframe(ignore_object_tags=['$type'],
                                            object_separator='id')

            self.df.dropna(inplace=True)

            self.df = self.df[self.df.key == 'NbEmptyDocks']
            self.df['modified'] = self.df.modified.apply(lambda x: pd.to_datetime(x))
            self.df['modified'] = self.df['modified'].astype(np.int64)

            self.create_datasource_with_values(dataframe=self.df,
                                               sensor_tag='id',
                                               attribute_tag='key',
                                               value_tag='value',
                                               latitude_tag='lat',
                                               longitude_tag='lon',
                                               description_tag='sourceSystemKey',
                                               api_timestamp_tag='modified')
            self.importer_status.status = Status.success(__class__.__name__)
        except Exception as e:
            self.importer_status.status = Status.failure(
                __class__.__name__, e.__str__(), traceback.format_exc())
