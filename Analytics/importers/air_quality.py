import json
import time
import traceback
from datetime import datetime, timedelta
from typing import Union

import numpy as np
import requests

from Analytics.settings import GetConfig
from importers.base import BaseImporter
from importers.json_reader import JsonReader
from .state_decorator import Status, ImporterStatus


@GetConfig("KCLAirQuality", 'api_endpoints', 'air_quality')
class KCLAirQuality(BaseImporter):
    """
    Air Quality Importer

    It inherits from the base class and passes the required parameters to the
    base class constructor

    The class uses
        http://api.erg.kcl.ac.uk/AirQuality/Annual/MonitoringObjective/
        GroupName=London/Year=2010/Json
        to fetch the Sensor names which are SiteCodes from the API.
        It then gets the latest data after every hour and saves it in database
        @SiteCode: The sensor name
        @Latitude: The latitude tag for location
        @Longitude: The Longitude tag for location

        Using the list of @SiteCode it calls the
            http://api.erg.kcl.ac.uk/AirQuality/Data/Site/SiteCode=%s/
            StartDate=%s/EndDate=%s/Json
        and adds current date and next date. Once it has all the data for all
        the Sites, it makes a dataframe and calls create_datasource_with_values
        method of base class to save Sensor, attributes and data to the
        database.
        Refresh Time is 1 Hour but can also be changed to 24 hour as then we
        get all the data in one go.
    """
    importer_status = ImporterStatus.get_importer_status()

    def __init__(self):
        """
        Get configurations, Instantiate BaseImporter, Set ImporterStatus
        to __init__
        """

        super().__init__(self.API_NAME, self.BASE_URL, self.REFRESH_TIME,
                         self.API_KEY, self.API_CLASS, self.TOKEN_EXPIRY)

    def _create_datasource(self, headers: Union[str, None] = None) -> None:
        """
        Create DataSource
        :param headers: Request Headers
        """
        try:
            # Get SiteCodes and Location
            url = 'http://api.erg.kcl.ac.uk/AirQuality/Annual/MonitoringObjecti' \
                  've/GroupName=London/Year=2010/Json'

            j_reader = JsonReader(url=url, object_seperator='@SiteCode')

            _data = j_reader.fetch_data()

            j_reader.create_objects(data=_data,
                                    ignore_tags=['@SiteName', '@SiteType',
                                                 '@SiteLink', '@DataOwner',
                                                 '@DataManager',
                                                 '@LatitudeWGS84',
                                                 '@LongitudeWGS84',
                                                 '@SpeciesCode',
                                                 '@SpeciesDescription',
                                                 '@Year',
                                                 '@ObjectiveName', '@Value',
                                                 '@Achieved'])
            _code_df = j_reader.create_dataframe()
            _codes = _code_df['@SiteCode'].tolist()
            zipped_codes = zip(_codes, _code_df['@Latitude'].tolist(),
                               _code_df['@Longitude'].tolist())
            _codes_location = {site_code: [lat, lon] for site_code, lat, lon
                               in list(zipped_codes)}

            # Fetching day data
            _date = datetime.utcnow()
            _today = _date.strftime('%d.%m.%Y')
            _tomorrow = (_date + timedelta(days=1)).strftime('%d.%m.%Y')
            self.df = None
            for code in _codes:
                self.url = self.BASE_URL % (code, _today, _tomorrow)
                print(self.url)
                data = requests.get(self.url + self.api_key, headers=headers)
                dataset = json.loads(data.text)
                jr = JsonReader(object_seperator='@SpeciesCode')
                jr.create_objects(dataset)
                _df = jr.create_dataframe()
                _dates = _df['@MeasurementDateGMT'].tolist()
                _new_dates = []
                for d in _dates:
                    if d is None or d is '' or d is np.nan:
                        _new_dates.append(np.nan)
                        continue

                    s = time.mktime(datetime.strptime(
                        str(d), '%Y-%m-%d %H:%M:%S').timetuple())
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

            self.create_datasource_with_values(dataframe=self.df,
                                               sensor_tag='@SiteCode',
                                               attribute_tag='@SpeciesCode',
                                               value_tag='@Value',
                                               latitude_tag='@Latitude',
                                               longitude_tag='@Longitude',
                                               description_tag='@Description',
                                               api_timestamp_tag='@MeasurementDateGMT')
            self.importer_status.status = Status.success(__class__.__name__)
        except Exception as e:
            self.importer_status.status = Status.failure(__class__.__name__,
                                                         e.__str__(),
                                                         traceback.format_exc())
