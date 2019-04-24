import json
import logging
import traceback
import sys
from datetime import datetime, timedelta
from typing import Union

import numpy as np
import pandas as pd

from importers.base import BaseImporter, Location
from models import location
from models.sensor import Sensor
from .state_decorator import ImporterStatus, Status
from .token_exception import TokenExpired

sys.path.append("../..")
from settings import GetConfig

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


@GetConfig("MilanAPI", 'api_endpoints', 'milan')
class MilanAPI(BaseImporter):
    """
    Milan Importer
    The class inherits from BaseImporter and doesn't contain any bespoke code
    apart from converting the data from json to tabular format but using BaseImporter methods
    The api doesn't have any credentials and doesn't have any key or token expiry
    """
    importer_status = ImporterStatus.get_importer_status()

    def __init__(self) -> None:
        """
        Get Import configurations
        Instantiate BaseImporter
        """

        super().__init__(self.API_NAME, self.BASE_URL, self.REFRESH_TIME,
                         self.API_KEY, self.API_CLASS,
                         self.TOKEN_EXPIRY)

    def _create_datasource(self, headers: Union[str, None] = None) -> None:
        """
        Create DataSource
        :param headers: Request Headers
        """
        try:
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
            self.importer_status.status = Status.success(__class__.__name__)
        except Exception as e:
            self.importer_status.status = Status.failure(__class__.__name__, e.__str__(), traceback.format_exc())

    def _refresh_token(self) -> None:
        """
        Refresh Token
        """
        logger.info('Token Expired')
        raise TokenExpired("Token Expired")


@GetConfig("Milan_API_sensori_meteo_meta", 'api_endpoints',
           'milan_sensori_meteo_meta')
class Milan_API_sensori_meteo_meta(BaseImporter):
    """
    Milan Importer
    The class inherits from BaseImporter and doesn't contain any bespoke code
    apart from converting the data from json to tabular format but using BaseImporter methods
    The api doesn't have any credentials and doesn't have any key or token expiry
    """
    importer_status = ImporterStatus.get_importer_status()

    def __init__(self) -> None:
        """
        Get Import configurations
        Instantiate BaseImporter
        """

        super().__init__(self.API_NAME, self.BASE_URL, self.REFRESH_TIME,
                         self.API_KEY, self.API_CLASS,
                         self.TOKEN_EXPIRY)

    def _create_datasource(self, headers: Union[str, None] = None) -> None:
        """
        Create DataSource
        :param headers: Request Headers
        """
        try:
            if not headers:
                headers = json.loads(self.HEADERS.replace("'", '"'))

            super()._create_datasource(headers)
            self.df = self.create_dataframe(object_separator=None)
            self.df['api_timestamp_tag'] = datetime.now().timestamp()
            loc = Location('latitudine', 'longitudine')
            self.create_datasource(dataframe=self.df, sensor_tag='dev_eui', attribute_tag=['dev_eui'],
                                   unit_value=[], bespoke_unit_tag=[], description=['descrizione'],
                                   bespoke_sub_theme=[],
                                   location_tag=loc, sensor_prefix='', api_timestamp_tag='api_timestamp_tag',
                                   is_dependent=True)
            self.importer_status.status = Status.success(__class__.__name__)
        except Exception as e:
            self.importer_status.status = Status.failure(__class__.__name__, e.__str__(), traceback.format_exc())

    def _refresh_token(self) -> None:
        """
        Refresh Token
        """
        logger.info('Token Expired')
        raise TokenExpired("Token Expired")


@GetConfig("Milan_API_sensori_meteo", 'api_endpoints', 'milan_sensori_meteo')
class Milan_API_sensori_meteo(BaseImporter):
    """
    Milan Importer
    The class inherits from BaseImporter and doesn't contain any bespoke code
    apart from converting the data from json to tabular format but using BaseImporter methods
    The api doesn't have any credentials and doesn't have any key or token expiry
    """
    importer_status = ImporterStatus.get_importer_status()

    def __init__(self) -> None:
        """
        Get Import configurations
        Instantiate BaseImporter
        """
        self.get_config()
        self.BASE_URL += 'data_inizio={0}%2000%3A00%3A01&data_fine={1}%2000%3A00%3A01'.format(
            (datetime.now() - timedelta(1)).strftime('%Y-%m-%d'), datetime.now().strftime('%Y-%m-%d'))
        super().__init__(self.API_NAME, self.BASE_URL, self.REFRESH_TIME, self.API_KEY, self.API_CLASS,
                         self.TOKEN_EXPIRY)

    def _create_datasource(self, headers: Union[str, None] = None) -> None:
        """
        Create DataSource
        :param headers: Request Headers
        """
        try:
            if not headers:
                headers = json.loads(self.HEADERS.replace("'", '"'))

            super()._create_datasource(headers)

            self.df = self.create_dataframe(object_separator=None)
            names = self.df['dev_eui'].tolist()
            name_set = set()
            location_sensor = {}

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
            self.importer_status.status = Status.success(__class__.__name__)
        except Exception as e:
            self.importer_status.status = Status.failure(__class__.__name__, e.__str__(), traceback.format_exc())

    def _refresh_token(self) -> None:
        """
        Refresh Token
        """
        logger.info('Token Expired')
        raise TokenExpired("Token Expired")


@GetConfig("Milan_API_sc_parking_kiunsys_meta", 'api_endpoints',
           'milan_sc_parking_kiunsys_meta')
class Milan_API_sc_parking_kiunsys_meta(BaseImporter):
    """
    Milan Importer
    The class inherits from BaseImporter and doesn't contain any bespoke code
    apart from converting the data from json to tabular format but using BaseImporter methods
    The api doesn't have any credentials and doesn't have any key or token expiry
    """
    importer_status = ImporterStatus.get_importer_status()

    def __init__(self) -> None:
        """
        Get Import configurations
        Instantiate BaseImporter
        """
        super().__init__(self.API_NAME, self.BASE_URL, self.REFRESH_TIME,
                         self.API_KEY, self.API_CLASS,
                         self.TOKEN_EXPIRY)

    def _create_datasource(self, headers: Union[str, None] = None) -> None:
        """
        Create DataSource
        :param headers: Request Headers
        """
        try:
            if not headers:
                json.loads(self.HEADERS.replace("'", '"'))

            super()._create_datasource(headers)

            self.df = self.create_dataframe(object_separator=None)
            self.df['api_timestamp_tag'] = datetime.now().timestamp()

            ### The response contains null coordinates...Filling them with SHCS02001 coordinates.
            self.df['latitude'].fillna(value=self.df.iloc[0]['latitude'], inplace=True)
            self.df['longitude'].fillna(value=self.df.iloc[0]['longitude'], inplace=True)

            loc = Location('latitude', 'longitude')
            self.create_datasource(dataframe=self.df, sensor_tag='code',
                                   attribute_tag=['parkingSpotType', 'positionOnMap'],
                                   unit_value=[], bespoke_unit_tag=[], description=['description'],
                                   bespoke_sub_theme=[],
                                   location_tag=loc, sensor_prefix='', api_timestamp_tag='api_timestamp_tag',
                                   is_dependent=True)
            self.importer_status.status = Status.success(__class__.__name__)
        except Exception as e:
            self.importer_status.status = Status.failure(__class__.__name__, e.__str__(), traceback.format_exc())

    def _refresh_token(self) -> None:
        """
        Refresh Token
        """
        logger.info('Token Expired')
        raise TokenExpired("Token Expired")


@GetConfig("Milan_API_sc_parking_kiunsys", 'api_endpoints',
           'milan_sc_parking_kiunsys')
class Milan_API_sc_parking_kiunsys(BaseImporter):
    """
    Milan Importer
    The class inherits from BaseImporter and doesn't contain any bespoke code
    apart from converting the data from json to tabular format but using BaseImporter methods
    The api doesn't have any credentials and doesn't have any key or token expiry
    """
    importer_status = ImporterStatus.get_importer_status()

    def __init__(self) -> None:
        """
        Get Import configurations
        Instantiate BaseImporter
        """

        self.BASE_URL += 'datetime={0}'.format(
            datetime.now().strftime('%Y%m%d%H%m%S'))
        super().__init__(self.API_NAME, self.BASE_URL, self.REFRESH_TIME,
                         self.API_KEY, self.API_CLASS,
                         self.TOKEN_EXPIRY)

    def _create_datasource(self, headers: Union[str, None] = None) -> None:
        """
        Create DataSource
        :param headers: Request Headers
        """
        try:
            if not headers:
                headers = json.loads(self.HEADERS.replace("'", '"'))

            super()._create_datasource(headers)
            self.df = self.create_dataframe(object_separator=None)

            self.df['latitude'] = 0.
            self.df['longitude'] = 0.

            for i in range(0, len(self.df)):
                lid = Sensor.get_by_name_in([self.df.parkingSpotSensorCode.iloc[i]])[0].l_id
                loc = location.Location.get_by_id_in([lid])[0]
                self.df.set_value(i, 'latitude', loc.lat)
                self.df.set_value(i, 'longitude', loc.lon)

            self.df['api_timestamp_tag'] = pd.to_datetime(self.df['datetime'])
            self.df['api_timestamp_tag'] = self.df['api_timestamp_tag'].astype(int)
            loc = Location('latitude', 'longitude')

            self.create_datasource(dataframe=self.df, sensor_tag='parkingSpotSensorCode',
                                   attribute_tag=['state'],
                                   unit_value=[], bespoke_unit_tag=[], description=['No Description'],
                                   bespoke_sub_theme=[], location_tag=loc, sensor_prefix='',
                                   api_timestamp_tag='api_timestamp_tag')
            self.importer_status.status = Status.success(__class__.__name__)
        except Exception as e:
            self.importer_status.status = Status.failure(__class__.__name__, e.__str__(), traceback.format_exc())

    def _refresh_token(self) -> None:
        """
        Refresh Token
        """
        logger.info('Token Expired')
        raise TokenExpired("Token Expired")


@GetConfig("Milan_API_sc_emobility_refeel", 'api_endpoints',
           'milan_sc_emobility_refeel')
class Milan_API_sc_emobility_refeel(BaseImporter):
    """
    Milan Importer
    The class inherits from BaseImporter and doesn't contain any bespoke code
    apart from converting the data from json to tabular format but using BaseImporter methods
    The api doesn't have any credentials and doesn't have any key or token expiry
    """
    importer_status = ImporterStatus.get_importer_status()

    def __init__(self) -> None:
        """
        Get Import configurations
        Instantiate BaseImporter
        """

        self.BASE_URL += 'fromTime={0}&toTime={1}'.format(
            (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%dT%H:%m:%SZ'),
            (datetime.now()).strftime('%Y-%m-%dT%H:%m:%SZ'))
        super().__init__(self.API_NAME, self.BASE_URL, self.REFRESH_TIME,
                         self.API_KEY, self.API_CLASS,
                         self.TOKEN_EXPIRY)

    def _create_datasource(self, headers: Union[str, None] = None) -> None:
        """
        Create DataSource
        :param headers: Request Headers
        """
        try:
            if not headers:
                headers = json.loads(self.HEADERS.replace("'", '"'))
            super()._create_datasource(headers)

            data = self.load_dataset(headers)
            df = pd.DataFrame(columns=['plate', 'rentalState', 'date', 'duration'])
            index = 0

            for plate in data[0]['vehicles']:
                for s in plate['statuses']:
                    df.at[index, 'plate'] = plate['plate']
                    df.at[index, 'rentalState'] = s['rentalState']
                    df.at[index, 'date'] = s['dateFrom']
                    df.at[index, 'duration'] = np.abs((datetime.strptime(s['dateTill'], '%Y-%m-%dT%H:%M:%SZ') - \
                                                       datetime.strptime(s['dateFrom'],
                                                                         '%Y-%m-%dT%H:%M:%SZ')).total_seconds())
                    index = index + 1

            df['latitude'] = 45.443384
            df['longitude'] = 9.221501
            loc = Location('latitude', 'longitude')

            df['api_timestamp_tag'] = pd.to_datetime(df['date'])
            df['api_timestamp_tag'] = df['api_timestamp_tag'].astype(int)

            self.create_datasource(dataframe=df, sensor_tag='plate',
                                   attribute_tag=['rentalState', 'duration'],
                                   unit_value=[7, 8], bespoke_unit_tag=[], description=['Information on activities '
                                                                                        'relted to two e-car used by '
                                                                                        'the inhabitants of a '
                                                                                        'condominium located in viale '
                                                                                        'Bacchiglione'],
                                   bespoke_sub_theme=[2, 2], location_tag=loc, sensor_prefix='',
                                   api_timestamp_tag='api_timestamp_tag')
            self.importer_status.status = Status.success(__class__.__name__)
        except Exception as e:
            self.importer_status.status = Status.failure(__class__.__name__, e.__str__(), traceback.format_exc())

    def _refresh_token(self) -> None:
        """
        Refresh Token
        """
        logger.info('Token Expired')
        raise TokenExpired("Token Expired")
