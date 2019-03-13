'''
Base Importer
All the importers needs to be extended from this class
The class provides methods to save API, Sensor, Attributes, Location and Data Tables
All the methods provided here can be overridden or can be extended by calling the super method 
from base class and then extending it in Child class
All new common functionality can be added to this base class, which then automatically be inherited 
by all the child classes.

Params:
    api_name: The name of the API, it needs to be unique, else database waring would be received
    url: The url which needs to be pinged to get the data, periodically
    refresh_time: After how many seconds the API needs to be pinged
    api_key: Key to access the API (if any)
    api_class: The full path of the class from package to class name like importers.air_quality.KCLAirQuality
    token_expiry: Time in which token will get expired, so that new token can be renewed again
                **(This functionality is not implemented yet and needs to implemented in database and Scheduler)**

'''

import os
import sys
from http import HTTPStatus
from typing import Any, TypeVar

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from db import db
from models.api import API
from models import location
from models.unit import Unit
from models.theme import Theme, SubTheme
from models.sensor import Sensor
from models.attributes import Attributes
from models.sensor_attribute import SensorAttribute
import json, requests
from importers.json_reader import JsonReader
import uuid
from geoalchemy2.elements import WKTElement
from models.attribute_data import ModelClass
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from utility import convert_unix_to_timestamp, convert_to_date
import sqlalchemy
from .state_decorator import Status, ImporterStatus
from .config_decorator import GetConfig
from collections.abc import Iterable

DateFrame = TypeVar('pd.DataFrame')


@GetConfig("BaseImporter", "config.yml")
class BaseImporter(object):
    """
    Importers base class
    """
    importer_status = ImporterStatus.get_importer_status()

    def __init__(self, api_name, url, refresh_time, api_key, api_class, token_expiry):
        """
        Instanciate Base importer
        :param api_name: api name
        :type api_name: str
        :param url: Url for data requests
        :type url: str
        :param refresh_time: Time to delay between requests
        :type refresh_time: int
        :param api_key: Api key for api endpoint
        :type api_key: str
        :param api_class: Class to instanciate for importer
        :type api_class: class
        :param token_expiry: Token expiry timestamp
        :type token_expiry: datetime
        """
        self.importer_status.status = Status.init_state(__name__, 'BaseImporter')
        self.api_name = api_name
        self.url = url
        self.refresh_time = refresh_time
        self.api_key = api_key
        self.token_expiry = token_expiry
        self.api_class = api_class
        self.dataset = None

    def _create_datasource(self, headers: str) -> None:
        """
        Create DataSource
        :param headers: Request headers
        :type headers: str
        :return: None
        """
        self.importer_status.status = Status.create_datasource(__name__, "load_dataset")
        response = self.load_dataset(headers)
        if isinstance(response, Iterable):
            _, status_code = response
            self.importer_status.status = Status.resquest(__name__, '_create_datasource', state='received',
                                                          status_code=status_code)
        else:
            self.importer_status.status = Status.resquest(__name__, '_create_datasource', state="Failure",
                                                          status_code=HTTPStatus.EXPECTATION_FAILED.value)
            return

        if status_code != 200:
            self._refresh_token()
            return

    def _refresh_token(self, *args):
        """
        Refresh token must be overriden by sub class
        :param args: Additional arguments
        :type args: Any
        :raises: NotImplementedError when not overriden by classs
        """
        self.importer_status.status = Status(__name__, action='_refresh_token', state='Not Implemented')
        raise NotImplementedError

    def load_dataset(self, headers: str) -> (Any, HTTPStatus):
        """
        Load Data set
        :param headers: Request headers
        :type headers: str
        :return: Data set and an HTTP status code
        """
        try:
            self.importer_status.status = Status(__name__, action='load_dataset', state='Request Data',
                                                 url=self.url.replace(' ', '').replace('\n', '') + self.api_key,
                                                 headers=headers)
            data = requests.get((self.url).replace(' ', '').replace('\n', '') + self.api_key, headers=headers)
        except Exception as e:
            self.importer_status.status = Status(__name__, action="Exception Requesting Data", exception=e.__str__())
            return

        self.importer_status.status = Status(__name__, action="load_dataset", state='Response Received',
                                             status_code=data.status_code)
        self.importer_status.status = Status(__name__, action="load_dataset", state='Parse data to JSON')
        try:
            self.dataset = json.loads(data.text)
        except Exception as e:
            self.importer_status.status = Status(__name__, action="Exception", exception=e.__str__())
            return

        self.importer_status.status = Status(__name__, action="load_dataset", state='Done')
        return self.dataset, data.status_code

    def create_dataframe(self, object_separator: str = None, ignore_tags: list = [], ignore_values: list = [],
                         ignore_tag_values: dict = {}, ignore_object_tags: list = []) -> DateFrame:
        """
        Create Pandas DataFrame
        :param object_separator: Token to tokenize entries
        :type object_separator: str
        :param ignore_tags: tags to be ignored
        :type ignore_tags: str
        :param ignore_values: Values to ignore
        :type ignore_values: Any
        :param ignore_tag_values: Values of tags to be ignored
        :type ignore_tag_values: Any
        :param ignore_object_tags: Object tags to be ignored
        :type ignore_object_tags: str
        :return: Pandas Data Frame
        """
        self.importer_status.status = Status(__name__, action="create_dataframe", status="Parse Data to JSON")
        jr = JsonReader(object_seperator=object_separator)
        self.importer_status.status = Status(__name__, action="create_dataframe", status="Create Objects")

        # if not self.dataset:
        #     self.importer_status.status = Status(__name__, action="create_dataframe",
        #                                          status="object has no attribute 'dataset'", )
        #     return
        try:
            jr.create_objects(self.dataset, ignore_tags=ignore_tags, ignore_values=ignore_values,
                              ignore_tag_values=ignore_tag_values, ignore_object_tags=ignore_object_tags)
            self.importer_status.status = Status(__name__, action="create_dataframe", status="Create DataFrame")
            df = jr.create_dataframe()
            self.importer_status.status = Status(__name__, action="create_dataframe", status="Doner")
        except Exception as e:
            self.importer_status.status = Status(__name__, action="Exception", exception=e.__str__())
            return None
        return df

    '''
    The methods setup the database for the new Importer/API
    @Params
    sensor_tag: Takes a column name from the dataframe whose value would act as sensor
    attribute_tag: Takes a list of column names from the DataFrame
    unit_value: Takes a list of column names from DataFrame which would act as unit value 
                for an attribute and they need to be passed in the same order as attribute
                e.g
                passing an attribute list as ['no2', 'rainfall'] which are 2 separate cols in dataframe
                and if their unit values are contained in two separate cols in dataframe like 
                ['no2_unit', 'rainfall_unit'], then these two unit col names should come in the same 
                order, if only one col name is provided for 2 attributes then that one unit value col 
                would be assigned both attributes.
                If you want to assign the unit value to one col e.g for 2 attributes 
                ['no2', 'rainfall'], you have only one unit value col ['no2_unit'] and dont want 
                it to get assigned to rainfall attribute then pass the unit_value as 
                ['no2_unit', None]
    besopke_unit_tag: Accepts a list and follows the same principle as unit_value, unit tag is usually something like 
                a unit that a value is expressed in like kg but this has to exists in our database.

    location_tag: Takes an object of Location class which in turn contains the name of the latitude and longitude cols.
    sensor_prefix: Takes a string, which would be prefixed to all the sensor tags
    '''

    def create_datasource(self, dataframe, sensor_tag: str, attribute_tag: list,
                          unit_value: list, description: list, bespoke_unit_tag: list,
                          bespoke_sub_theme: list, location_tag: location.Location,
                          data_tag: list = [], sensor_prefix: str = None, api_timestamp_tag: str = None,
                          check_sensor_exists_by_name: bool = False,
                          check_sensor_exists_by_name_loc: bool = False,
                          check_sensor_exists_by_name_api: bool = False, is_dependent: bool = False):
        """
        Create Data Source
        :param dataframe: pandas dataframe
        :type dataframe: DataFrame
        :param sensor_tag:
        :type sensor_tag:
        :param attribute_tag:
        :type attribute_tag:
        :param unit_value:
        :type unit_value:
        :param description:
        :type description:
        :param bespoke_unit_tag:
        :type bespoke_unit_tag:
        :param bespoke_sub_theme:
        :type bespoke_sub_theme:
        :param location_tag:
        :type location_tag:
        :param data_tag:
        :type data_tag:
        :param sensor_prefix:
        :type sensor_prefix:
        :param api_timestamp_tag:
        :type api_timestamp_tag:
        :param check_sensor_exists_by_name:
        :type check_sensor_exists_by_name:
        :param check_sensor_exists_by_name_loc:
        :type check_sensor_exists_by_name_loc:
        :param check_sensor_exists_by_name_api:
        :type check_sensor_exists_by_name_api:
        :param is_dependent:
        :type is_dependent:
        :return:
        :rtype:
        """
        self.importer_status.status = Status(__name__, action="create_datasource", status="Stage API Commit")
        api_id = self.stage_api_commit()
        self.importer_status.status = Status(__name__, action="create_datasource", status="Staged API Commit")
        # Location tag
        latitude, longitude = None, None

        try:
            if location_tag is not None:
                latitude = dataframe[location_tag.lat].tolist()
                longitude = dataframe[location_tag.lon].tolist()
        except Exception as e:
            self.importer_status.status = Status(__name__, action="Exception", exception=e.__str__())
            return None

        self.importer_status.status = Status(__name__, action="create_datasource", status="Save location and sensor")
        # Save location and sensor
        sensor_objects = self.save_sensors(dataframe[sensor_tag].tolist(), latitude, longitude, api_id,
                                           sensor_prefix,
                                           check_sensor_exists_by_name=check_sensor_exists_by_name,
                                           check_sensor_exists_by_name_loc=check_sensor_exists_by_name_loc,
                                           check_sensor_exists_by_name_api=check_sensor_exists_by_name_api,
                                           is_dependent=is_dependent)

        self.importer_status.status = Status(__name__, action="create_datasource", status="Save Attributes")
        # Save Attributes
        attr_objects = self.save_attributes(attribute_tag, unit_value, description,
                                            bespoke_unit_tag, bespoke_sub_theme)

        self.importer_status.status = Status(__name__, action="create_datasource",
                                             status="Save attribute and sensor relation")
        # Save attribute and sensor relation
        self.save_attr_sensor(attr_objects, sensor_objects.values())
        self.importer_status.status = Status(__name__, action="create_datasource", status="Create dB Tables")
        self.create_tables(attr_objects)
        self.importer_status.status = Status(__name__, action="create_datasource", status="Insert Data")
        self.insert_data(attr_objects, sensor_objects, dataframe, sensor_tag, sensor_prefix, api_timestamp_tag)

    '''
    This follows the same logic as the method above, the only difference it that it considers
    values of the tags as sensors, attributes and data values instead of the tags themselves
    e.g
        A      B      C
        BG1    NO2    22
        BG2    SO2    23

    Consider this short data table in method above the column heading are the Attributes and their data are 
    their values
    So the values get saved like Attribute 'B' and Value 'NO2'

    In this method the values of the column are Attributes and Column C contain values of Column B
    So the values get saved like Attribute 'NO2' and Value '22'

    That is why it has an additional value tag
    '''

    def create_datasource_with_values(self, dataframe, sensor_tag, attribute_tag, value_tag,
                                      latitude_tag, longitude_tag, description_tag,
                                      api_timestamp_tag=None,
                                      unit_tag=None, unit_value_tag=None,
                                      unit_id=1, unit_value=1, sub_theme=1):
        """
        Create Data Source with values
        :param dataframe:
        :type dataframe:
        :param sensor_tag:
        :type sensor_tag:
        :param attribute_tag:
        :type attribute_tag:
        :param value_tag:
        :type value_tag:
        :param latitude_tag:
        :type latitude_tag:
        :param longitude_tag:
        :type longitude_tag:
        :param description_tag:
        :type description_tag:
        :param api_timestamp_tag:
        :type api_timestamp_tag:
        :param unit_tag:
        :type unit_tag:
        :param unit_value_tag:
        :type unit_value_tag:
        :param unit_id:
        :type unit_id:
        :param unit_value:
        :type unit_value:
        :param sub_theme:
        :type sub_theme:
        :return:
        :rtype:
        """
        self.importer_status.status = Status(__name__, action="create_datasource_with_values",
                                             status="Stage API commit")

        api_id = self.stage_api_commit()
        _unit = None
        _unit_value = None

        sensors = dataframe[sensor_tag].tolist()
        attributes = dataframe[attribute_tag].tolist()
        latitude = dataframe[latitude_tag].tolist()
        longitude = dataframe[longitude_tag].tolist()
        description = dataframe[description_tag].tolist()

        if unit_tag is None:
            _unit = unit_id
        else:
            _unit = dataframe[unit_tag].tolist()

        if unit_value_tag is None:
            _unit_value = unit_value
        else:
            _unit_value = dataframe[unit_value_tag].tolist()

        self.importer_status.status = Status(__name__, action="create_datasource_with_values",
                                             status="Save Sensors")
        sensor_objects = self.save_sensors(sensors, latitude, longitude, api_id, None,
                                           check_sensor_exists_by_name=False,
                                           check_sensor_exists_by_name_loc=False,
                                           check_sensor_exists_by_name_api=False)

        self.importer_status.status = Status(__name__, action="create_datasource_with_values",
                                             status="Save Attributes")
        attr_objects = self.save_attributes(attributes,
                                            _unit_value if isinstance(_unit_value, list) else [_unit_value],
                                            description,
                                            _unit if isinstance(_unit, list) else [_unit],
                                            [sub_theme])
        self.importer_status.status = Status(__name__, action="create_datasource_with_values",
                                             status="Save Attribute to Sensors Relations")
        self.save_attr_sensor(attr_objects, sensor_objects.values())
        self.importer_status.status = Status(__name__, action="create_datasource_with_values",
                                             status="Create dB tables")
        self.create_tables(attr_objects)
        self.importer_status.status = Status(__name__, action="create_datasource_with_values",
                                             status="Insert Data")
        self.insert_data(attr_objects, sensor_objects, dataframe, sensor_tag, '',
                         api_timestamp_tag, value_tag, attribute_tag, unit_value_tag)
        self.importer_status.status = Status(__name__, action="create_datasource_with_values", status="Done")

    def save_sensors(self, sensors: list, latitude: list, longitude: list, api_id, sensor_prefix, **kwargs) -> dict:
        """
        Save Sensor Values
        :param sensors:
        :type sensors:
        :param latitude:
        :type latitude:
        :param longitude:
        :type longitude:
        :param api_id:
        :type api_id:
        :param sensor_prefix:
        :type sensor_prefix:
        :param kwargs:
        :type kwargs:
        :return:
        :rtype:
        """
        self.importer_status.status = Status(__name__, action="save_sensors", status="Save Sensors")
        sensor_objects = {}
        sensor_exists = set()

        for i in range(len(sensors)):
            # if sensor already exists dont save
            if kwargs['check_sensor_exists_by_name']:
                s_name = sensor_prefix + str(sensors[i]) if sensor_prefix is not None else str(sensors[i])
                _sensor = Sensor.get_by_name(s_name)
                if _sensor:
                    sensor_objects[_sensor.name] = _sensor
                    continue

            if kwargs['check_sensor_exists_by_name_loc']:
                s_name = sensor_prefix + str(sensors[i]) if sensor_prefix is not None else str(sensors[i])
                _sensor = Sensor.get_by_name_loc(s_name, None)  # This needs to be fixed
                if _sensor:
                    sensor_objects[_sensor.name] = _sensor
                    continue

            if kwargs['check_sensor_exists_by_name_api']:
                s_name = sensor_prefix + str(sensors[i]) if sensor_prefix is not None else str(sensors[i])
                _sensor = Sensor.get_by_name_api(s_name, api_id)
                if _sensor:
                    sensor_objects[_sensor.name] = _sensor
                    continue

            loc = self.save_location(float(latitude[i]), float(longitude[i]))

            s_name = sensor_prefix + str(sensors[i]) if sensor_prefix is not None else str(sensors[i])
            _hash = self._hash_it(str(api_id), str(loc.id), s_name)
            if _hash in sensor_exists:
                continue

            if 'is_dependent' in kwargs:
                if kwargs['is_dependent']:
                    _sensor = Sensor._get_by_api_location_name(a_id=api_id, l_id=loc.id, name=s_name)
                    if _sensor:
                        sensor_objects[_sensor.name] = _sensor
                        sensor_exists.add(_hash)
                        print(s_name, 'sensor already exists with API ID:', str(api_id), 'and Location ID:',
                              str(loc.id))
                        continue

            sensor = Sensor(str(uuid.uuid4()), api_id, loc.id, s_name)
            sensor_exists.add(_hash)

            sensor = sensor.save()
            sensor_objects[sensor.name] = sensor

        # db.session.flush()
        self.importer_status.status = Status(__name__, action="save_sensors", status="Done")
        return sensor_objects

    def save_location(self, latitude: float, longitude: float):
        """
        Save location data
        :param latitude: GPS Latitude
        :type latitude: str
        :param longitude: Gps Longitude
        :type longitude: str
        :return: The location
        """
        self.importer_status.status = Status(__name__, action="save_location", status="Save Location")
        loc = location.Location.get_by_lat_lon(latitude, longitude)
        if not loc:
            loc = location.Location(latitude, longitude, WKTElement('POINT(%f %f)' % (latitude, longitude), 4326))
            loc.save()

        self.importer_status.status = Status(__name__, action="save_location", status="Done")
        return loc

    def save_attributes(self, attribute_tag: list, unit_value: list, description: list,
                        bespoke_unit_tag: list, bespoke_sub_theme: list) -> list:
        """
        Save attributes
        :param attribute_tag:
        :type attribute_tag:
        :param unit_value:
        :type unit_value:
        :param description:
        :type description:
        :param bespoke_unit_tag:
        :type bespoke_unit_tag:
        :param bespoke_sub_theme:
        :type bespoke_sub_theme:
        :return:
        :rtype:
        """
        self.importer_status.status = Status(__name__, action="save_attributes", status="Save Attributes")
        attr_objects = []
        attr_exists = set()
        for i in range(len(attribute_tag)):
            uv = None
            but = None
            bst = None
            des = None
            if len(unit_value) == len(attribute_tag):
                uv = unit_value[i]
            else:
                if len(unit_value) > 0:
                    uv = unit_value[0]

            if len(description) == len(attribute_tag):
                des = description[i]
            else:
                if len(description) > 0:
                    des = description[0]

            if len(bespoke_unit_tag) == len(attribute_tag):
                but = bespoke_unit_tag[i]
            else:
                if len(bespoke_unit_tag) > 0:
                    but = bespoke_unit_tag[0]

            if len(bespoke_sub_theme) == len(attribute_tag):
                bst = bespoke_sub_theme[i]
            else:
                if len(bespoke_sub_theme) > 0:
                    bst = bespoke_sub_theme[0]

            _hash = self._hash_it(str(attribute_tag[i]), str(but), str(uv))
            if _hash in attr_exists:
                continue

            a = self.stage_attributes(attribute_tag[i], uv, but, bst, des)
            attr_objects.append(a)
            attr_exists.add(_hash)
        self.importer_status.status = Status(__name__, action="save_attributes", status="Done")
        # db.session.flush()
        return attr_objects

    def stage_attributes(self, attribute: str, unit_value: str,
                         bespoke_unit_tag: int, bespoke_sub_theme: int,
                         description: str):
        """

        :param attribute:
        :type attribute:
        :param unit_value:
        :type unit_value:
        :param bespoke_unit_tag:
        :type bespoke_unit_tag:
        :param bespoke_sub_theme:
        :type bespoke_sub_theme:
        :param description:
        :type description:
        :return:
        :rtype:
        """
        _a = Attributes._get_by_name_unit_unitvalue(attribute, bespoke_unit_tag, unit_value)
        if _a:
            self.importer_status.status = Status(__name__, action="stage_attributes", status=(
                attribute, 'attribute with Unit ID:', str(bespoke_unit_tag), 'and Unit Value:', unit_value,
                'already exists'))
            # print(attribute, 'attribute with Unit ID:', str(bespoke_unit_tag), 'and Unit Value:', unit_value,
            #       'already exists')
            return _a
        self.importer_status.status = Status(__name__, action="stage_attributes", status="Create Attribute")
        a = Attributes(id=str(uuid.uuid4()), name=attribute,
                       table_name=(attribute + '_' + str(uuid.uuid4()).replace('-', '_')),
                       sub_theme=bespoke_sub_theme, unit=bespoke_unit_tag,
                       unit_value=str(unit_value), description=description)
        a = a.save()
        self.importer_status.status = Status(__name__, action="stage_attributes", status="Saved")
        return a

    def save_attr_sensor(self, attrs, sensors):
        """

        :param attrs:
        :type attrs:
        :param sensors:
        :type sensors:
        :return:
        :rtype:
        """
        self.importer_status.status = Status(__name__, action="save_attr_sensor",
                                             status="Save Sensor Attribute relationship")
        for sensor in sensors:
            for attr in attrs:
                _sa = SensorAttribute._get_by_sid_aid(sensor.id, attr.id)
                if _sa:
                    self.importer_status.status = Status(__name__, action="save_attr_sensor",
                                                         status=('Sensor ID: %s, Attribute Id: %s already exists' % (
                                                             _sa.s_id, _sa.a_id)))
                    # print('Sensor ID: %s, Attribute Id: %s already exists' % (_sa.s_id, _sa.a_id))
                    continue

                sa = SensorAttribute(sensor.id, attr.id)
                sa.save()
                self.importer_status.status = Status(__name__, action="save_attr_sensor",
                                                     status="Saved")
        # db.session.flush()

    def create_tables(self, attributes):
        """

        :param attributes:
        :type attributes:
        :return:
        :rtype:
        """
        self.importer_status.status = Status(__name__, action="create_tables", status="Creating Tables")
        table_query = db.session.execute("select * from pg_catalog.pg_tables")
        table_tuples = table_query.fetchall()
        tables = set()
        for t in table_tuples:
            tables.add(t[1])

        for attr in attributes:
            if attr.table_name.lower() not in tables:
                db.session.execute(
                    'CREATE TABLE %s (s_id TEXT NOT NULL, value TEXT NOT NULL, api_timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL, timestamp TIMESTAMP WITHOUT TIME ZONE, PRIMARY KEY(s_id, value, api_timestamp))' % (
                        attr.table_name))
                print('Created Table', attr.table_name.lower())
                self.importer_status.status = Status(__name__, action="create_tables", status="Created Table",
                                                     table_name=attr.table_name.lower())

            else:
                print(attr.table_name.replace('-', '_'), 'already exists')
                self.importer_status.status = Status(__name__, action="create_tables", status="Table already exists",
                                                     table_name=attr.table_name.replace('-', '_'))

    def insert_data(self, attr_objects, sensor_objects: dict, dataframe,
                    sensor_tag, sensor_prefix, api_timestamp_tag, attr_value_tag=None,
                    attribute_tag=None, unit_value_tag=None):
        """

        :param attr_objects:
        :type attr_objects:
        :param sensor_objects:
        :type sensor_objects:
        :param dataframe:
        :type dataframe:
        :param sensor_tag:
        :type sensor_tag:
        :param sensor_prefix:
        :type sensor_prefix:
        :param api_timestamp_tag:
        :type api_timestamp_tag:
        :param attr_value_tag:
        :type attr_value_tag:
        :param attribute_tag:
        :type attribute_tag:
        :param unit_value_tag:
        :type unit_value_tag:
        :return:
        :rtype:
        """
        self.importer_status.status = Status(__name__, action="insert_data", status="Insert Data")
        db.metadata.clear()
        sensors = dataframe[sensor_tag].tolist()
        value_exists = set()
        _classes = []

        api_timestamp = []
        if api_timestamp_tag is not None:
            api_timestamp = dataframe[api_timestamp_tag].tolist()

        for attr in attr_objects:
            _values = []
            if attr_value_tag is not None:
                _dataframe = None
                if unit_value_tag is not None:
                    _dataframe = dataframe[
                        (dataframe[attribute_tag] == attr.name) & (dataframe[unit_value_tag] == attr.unit_value)]
                else:
                    _dataframe = dataframe[dataframe[attribute_tag] == attr.name]

                _values = _dataframe[attr_value_tag].tolist()
                sensors = _dataframe[sensor_tag].tolist()

            model = ModelClass(attr.table_name.lower())
            _classes.append(model)
            values = []
            models = []

            if attr_value_tag is None:
                values = dataframe[attr.name].tolist()
            else:
                values = _values

            for i in range(len(values)):
                sensor_name = sensors[i]
                sensor_id = sensor_objects[sensor_prefix + str(sensor_name)].id

                a_date = None
                if len(api_timestamp) > 0 and api_timestamp[i]:
                    a_date = convert_unix_to_timestamp(str(api_timestamp[i]))
                    _, a_date = convert_to_date(a_date)

                if a_date is None:
                    a_date = datetime.utcnow()

                _hash = self._hash_it(sensor_prefix + str(sensor_name), str(values[i]), str(a_date))
                if _hash in value_exists:
                    continue

                m = model()
                m.s_id = sensor_id
                m.value = values[i]
                m.api_timestamp = a_date
                m.timestamp = datetime.utcnow()
                models.append(m)

                try:
                    if i % 10 == 0:
                        db.session.add_all(models)
                        db.session.commit()
                except IntegrityError as e:
                    db.session.rollback()
                    self.importer_status.status = Status(__name__, action="Exception", status="Session rollback",
                                                         exception=e.__str__(),
                                                         data=('Sensor id: %s with value %s at time %s already exists'
                                                               % (sensor_id, values[i], a_date)))
                    # To improve logging uncomment the line below
                    # print('Sensor id: %s with value %s at time %s already exists' % (sensor_id, values[i], a_date))

                value_exists.add(_hash)

            db.session.add_all(models)

        try:
            self.importer_status.status = Status(__name__, action="insert_data", status="Commiting session to db")
            db.session.commit()
            for _class in _classes:
                sqlalchemy.orm.instrumentation.unregister_class(_class)
                del _class._decl_class_registry[_class.__name__]
        except IntegrityError as e:
            db.session.rollback()
            self.importer_status.status = Status(__name__, action="Exception", status="Session rollback",
                                                 exception=e.__str__())
            print('Unable to save certain values as they already are in the system, check logs')

    def _hash_it(self, *args):
        """

        :param args:
        :type args:
        :return:
        :rtype:
        """
        to_hash = ''
        for a in args:
            to_hash += a

        return abs(hash(to_hash)) % (10 ** 8)

    def stage_api_commit(self):
        """

        :return:
        :rtype:
        """
        self.importer_status.status = Status.general(__name__, 'stage_api_commit', 'commit api')
        api = API(name=self.api_name,
                  url=self.url, refresh_time=self.refresh_time,
                  token_expiry=self.token_expiry,
                  api_key=self.api_key, api_class=self.api_class)
        _api = api.save()
        return _api.id

    def create_unit(self, _type, description):
        """
        Create Unit
        :param _type:
        :type _type:
        :param description:
        :type description:
        :return:
        :rtype:
        """
        self.importer_status.status = Status(__name__, action="create_unit", status="Create Unit", type=_type,
                                             description=description)
        unit = Unit(_type=_type, description=description)
        unit.save()
        return unit

    def create_theme(self, name):
        """
        Create Theme
        :param name: Name of theme
        :type name: str
        :return: Theme
        """
        self.importer_status.status = Status(__name__, action="create_theme", status="Create Theme", name=name)
        theme = Theme(name=name)
        theme.save()
        return theme

    def create_subtheme(self, theme_id, name):
        """
        Create new SubTheme
        :param theme_id: Theme id
        :type theme_id: int
        :param name: SubTheme name
        :type name: str
        :return: Subtheme
        """
        self.importer_status.status = Status(__name__, action="create_subtheme", status="Create SubTheme",
                                             theme_id=theme_id, name=name)
        sub_theme = SubTheme(t_id=theme_id, name=name)
        sub_theme.save()
        return sub_theme

    def commit(self) -> None:
        """
        Commit change to database
        """
        self.importer_status.status = Status(__name__, action="commit", status="Commit to dB")
        db.session.commit()


class Location(object):
    def __init__(self, lat, lon):
        self.lat = lat
        self.lon = lon
