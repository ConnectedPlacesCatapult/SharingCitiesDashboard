import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from db import db
from models.api import API
from models import location
from models.unit import Unit
from models.theme import Theme, SubTheme
from models.sensor import Sensor
from models.attributes import Attributes
from models.sensor_attribute import SensorAttribute
from importers.read_json import ReadJson
import json, requests
from importers.attr_unit_desc import AttributeUnitDescription
from importers.json_reader import JsonReader
import pandas as pd
import uuid
from geoalchemy2.elements import WKTElement
from models.attribute_data import ModelClass
from datetime import datetime
from sqlalchemy.exc import ProgrammingError

def get_config:
    try:
        with open("config.yml", 'r') as ymlfile:
            config = yaml.load(ymlfile)
    except FileNotFoundError:
        print("Ensure that you have provided a config.yml file")
    else:
        break
    return(config)

class BaseImporter(object):
    def __init__(self, api_name, url, refresh_time, api_key, token_expiry):
        self.api_name = api_name
        self.url = url
        self.refresh_time = refresh_time
        self.api_key = api_key
        self.token_expiry = token_expiry

    def _create_datasource(self):
        _, status_code = self.load_dataset()
        if status_code != 200:
            self._refresh_token()

    def _refresh_token(self, *args):
        # This method needs to be overriden in child classes
        raise NotImplementedError

    def load_dataset(self):
        data = requests.get(self.url)
        self.dataset = json.loads(data.text)
        return self.dataset, data.status_code

    def create_dataframe(self, object_separator: str = None, ignore_tags: list = [], ignore_values: list = [], 
                            ignore_tag_values: dict= {}, ignore_object_tags: list = []):
        
        jr = JsonReader(object_seperator=object_separator)
        jr.create_objects(self.dataset, ignore_tags=ignore_tags, ignore_values= ignore_values, 
                            ignore_tag_values= ignore_tag_values, ignore_object_tags=ignore_object_tags)
        df = jr.create_dataframe()
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
                            data_tag: list = [], sensor_prefix: str = None, 
                            check_sensor_exists_by_name: bool = False,
                            check_sensor_exists_by_name_loc: bool = False,
                            check_sensor_exists_by_name_api: bool = False):

        # Check if API exists
        api_id = self.stage_api_commit()

        sensor_objects = {}
        attr_objects = []
        sensor_exists = set()
        latitude, longitude = None, None

        # Save location and sensor
        sensors = dataframe[sensor_tag].tolist()

        if location_tag is not None:
            latitude = dataframe[location_tag.lat].tolist()
            longitude = dataframe[location_tag.lon].tolist()
        # print(len(sensors), len(latitude), len(longitude))

        for i in range(len(sensors)):
            # if sensor already exists dont save
            if check_sensor_exists_by_name:
                s_name = sensor_prefix + str(sensors[i]) if sensor_prefix is not None else str(sensors[i])
                _sensor = Sensor.get_by_name(s_name)
                if _sensor:
                    sensor_objects[_sensor.name] = _sensor
                    continue
            
            if check_sensor_exists_by_name_loc:
                s_name = sensor_prefix + str(sensors[i]) if sensor_prefix is not None else str(sensors[i])
                _sensor = Sensor.get_by_name_loc(s_name, None) # This needs to be fixed
                if _sensor:
                    sensor_objects[_sensor.name] = _sensor
                    continue

            if check_sensor_exists_by_name_api:
                s_name = sensor_prefix + str(sensors[i]) if sensor_prefix is not None else str(sensors[i])
                _sensor = Sensor.get_by_name_api(s_name, api_id)
                if _sensor:
                    sensor_objects[_sensor.name] = _sensor
                    continue
            
            # Use hashing strategy for saving location as well
            loc = location.Location.get_by_lat_lon(latitude[i], longitude[i])
            if not loc:
                loc = location.Location(latitude[i], longitude[i], WKTElement('POINT(%f %f)' % (latitude[i], longitude[i]), 4326))
                loc.save()
            
            s_name = sensor_prefix + str(sensors[i]) if sensor_prefix is not None else str(sensors[i])
            # Create hash and check if it is in the dictionary,
            # if not in the dictionary then add it to the dict
            _hash = abs(hash(str(api_id) + str(loc.id) + s_name))%(10**8)

            if _hash in sensor_exists:
                continue
            sensor = Sensor(str(uuid.uuid4()), api_id, loc.id, s_name)
            sensor_exists.add(_hash)
            # Create hash and save it in dictionary
            sensor.save()

            sensor_objects[sensor.name] = sensor

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

            a = self.save_attributes(attribute_tag[i], uv, but, bst, des)
            attr_objects.append(a)

        # save attribute and sensor relation
        for sensor in sensor_objects.values():
            for attr in attr_objects:
                sa = SensorAttribute(sensor.id, attr.id)
                sa.save()

        self.create_tables(attr_objects)
        self.insert_data(attr_objects, sensor_objects, dataframe, sensor_tag, sensor_prefix)

    def save_attributes(self, attribute: str, unit_value: str, 
                        bespoke_unit_tag: int, bespoke_sub_theme: int,
                        description: str):
        a = Attributes(id=str(uuid.uuid4()), name=attribute, table_name=(attribute + '_' + str(uuid.uuid4()).replace('-', '_')), 
                        sub_theme=bespoke_sub_theme, unit=bespoke_unit_tag, 
                        unit_value=unit_value, description=description)
        a = a.save()
        return a

    def create_tables(self, attributes):
        for attr in attributes:
            try:
                db.session.execute('CREATE TABLE %s (id SERIAL PRIMARY KEY, s_id TEXT, value TEXT, timestamp TIMESTAMP WITHOUT TIME ZONE )' % (attr.table_name))
            except ProgrammingError:
                db.session.rollback()
                print(attr.table_name.replace('-', '_'), 'already exists')
            # print(ModelClass(attr.table_name))
        # db.session.commit()

    def insert_data(self, attr_objects, sensor_objects: dict, dataframe, sensor_tag, sensor_prefix):
        sensors = dataframe[sensor_tag].tolist()
        for attr in attr_objects:
            model = ModelClass(attr.table_name)
            values = dataframe[attr.name].tolist()
            for i in range(len(values)):
                sensor_name = sensors[i]
                sensor_id = sensor_objects[sensor_prefix + str(sensor_name)].id
                m = model()
                m.s_id = sensor_id
                m.value = values[i]
                m.timestamp = datetime.utcnow()
                db.session.add(m)

        db.session.commit()
        
    '''
    This method accepts name of sensor tag
    and list of name of location tag, if the list 
    contains only one item then it will be considered 
    as a geometry object
    '''
    def sensors(self, sensor: str, location: list, use_value_of_tag: bool):
        api_id = self.stage_api_commit()
        sensors_with_id = {}

        if use_value_of_tag:
            sensors_with_id = self.value_as_sensor(api_id, location, sensor)
        else:
            self.tag_as_sensor(api_id, location, sensor)
            
        return sensors_with_id

    def tag_as_sensor(self, api_id, location, sensor) -> list:
        values = []
        sensor_created = []
        location_values = ReadJson(None, location)
        location_values.get_location_by_tag_names(self.dataset, values)

        for loc in values:
            location_id = self.stage_location_commit(loc)
            _sensor = Sensor(a_id=api_id, l_id=location_id, 
                            name=sensor)
            _sensor.save()
            sensor_created.append(_sensor.id)
        return sensor_created

    def value_as_sensor(self, api_id, location, sensor) -> dict:
        values = {}
        # return dictionary to reference later
        sensor_created = {}
        sensor_values = ReadJson(sensor, location)
        sensor_values.get_sensor_by_tag_name(self.dataset, values)
        
        for key in values:
            location_id = self.stage_location_commit(values[key])
            _sensor = Sensor(api_id, location_id, key)
            _sensor.save()
            sensor_created[key] = _sensor.id

        return sensor_created

    def attributes(self, attribute_tag: list, as_tag=False) -> dict:
        values = {}
        if not as_tag:
            values = self.get_values(attribute_tag)
        else:
            pass
        return values

    def units(self, unit_tag: list, as_tag=False) -> dict:
        values = {}
        if not as_tag:
            values = self.get_values(unit_tag)
        else:
            pass
        return values

    def descriptions(self, description_tag: list, as_tag=False) -> dict:
        values = {}
        if not as_tag:
            values = self.get_values(description_tag)
        else:
            pass
        return values

    def merged_attr_unit_desc(self, attr: str, unit: str, desc: str):
        pass

    def get_values(self, tags) -> dict:
        values = set()
        _values = {}
        for tag in tags:
            a = ReadJson(tag, None)
            a.get_values_by_tag_name(self.dataset, values)
            _values[tag] = values
            values = set()
        
        return _values
    
    def join_attr_unit(self, attribute: str, unit: str):
        # List of AttributeUnitData objects
        a = AttributeUnitDescription()
        a.attribute = attribute
        a.unit_value = unit
        return a

    def join_attr_desc(self, attribute, description: str):
        '''
        attribute: should be an object of AttributeUnitDescription
        '''
        attribute.description = description

    def join_attr_unit_type(self, attribute: list, unit: int):
        '''
        attribute: should be a list of AttributeUnitDescription objects
        '''
        for a in attribute:
            a.unit_type = unit

        # return attribute

    def join_attr_sub_theme(self, attribute: list, subtheme: int):
        '''
        attribute: should be a list of AttributeUnitDescription objects
        '''
        for a in attribute:
            a.sub_theme = subtheme

        # return attribute

    def stage_api_commit(self):
        api = API(name=self.api_name, 
                    url=self.url, refresh_time=self.refresh_time,
                    token_expiry=self.token_expiry,
                    api_key=self.api_key)
        _api = api.get()

        if not _api:
            api.save()
            return api.id
        
        return _api.id

    def stage_location_commit(self, location):
        loc = location.get()

        if not loc:
            location.save()
            return location.id

        return loc.id

    def create_unit(self, _type, description):
        unit = Unit(_type=_type, description=description)
        unit.save()
        return unit.id

    def create_theme(self, name):
        theme = Theme(name=name)
        theme.save()
        return theme.id

    def create_subtheme(self, theme_id, name):
        sub_theme = SubTheme(t_id=theme_id, name=name)
        sub_theme.save()
        return sub_theme.id

    def commit(self):
        db.session.commit()

class Location(object):
    def __init__(self, lat, lon):
        self.lat = lat
        self.lon = lon
