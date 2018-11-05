import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from db import db
from models.api import API
from models.location import Location
from models.unit import Unit
from models.theme import Theme, SubTheme
from models.sensor import Sensor
from importers.read_json import ReadJson
import json, requests
from importers.attr_unit_desc import AttributeUnitDescription


class BaseImporter(object):
    def __init__(self, api_name, url, refresh_time, api_key, token_expiry):
        self.api_name = api_name
        self.url = url
        self.refresh_time = refresh_time
        self.api_key = api_key
        self.token_expiry = token_expiry
        self.dataset = self.load_dataset()

    def load_dataset(self):
        data = requests.get(self.url)
        _json = json.loads(data.text)
        return _json
        
    '''
    This method accepts name of sensor tag
    and list of name of location tag, if the list 
    contains only one item then it will be considered 
    as a geometry object
    '''
    def sensors(self, sensor: str, location: list, use_tag: bool):
        api_id = self.stage_api_commit()

        if use_tag:
            self.tag_as_sensor(api_id, location, sensor)
        else:
            self.value_as_sensor(api_id, location, sensor)

        # self.commit()

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

    def value_as_sensor(self, api_id, location, sensor) -> list:
        values = {}
        sensor_created = []
        sensor_values = ReadJson(sensor, location)
        sensor_values.get_sensor_by_tag_name(self.dataset, values)
        
        for key in values:
            location_id = self.stage_location_commit(values[key])
            _sensor = Sensor(api_id, location_id, key)
            _sensor.save()
            sensor_created.append(_sensor.id)

        return sensor_created

    def attributes(self, attribute_tag: list, as_tag=False):
        values = {}
        if not as_tag:
            values = self.get_values(attribute_tag)

    def units(self, unit_tag: list, as_tag=False):
        values = {}
        if not as_tag:
            values = self.get_values(unit_tag)

    def descriptions(self, description_tag: list, as_tag=False):
        values = {}
        if not as_tag:
            values = self.get_values(description_tag)

    def get_values(self, tags):
        values = set()
        _values = {}
        for tag in tags:
            a = ReadJson(tag, None)
            a.get_values_by_tag_name(self.dataset, values)
            _values[tag] = values
            values = set()
        
        return _values
    
    def join_attr_unit(self, attribute: str, unit: list):
        # List of AttributeUnitData objects
        attr_units = []
        for u in unit:
            a = AttributeUnitDescription()
            a.attribute = attribute
            a.unit_value = u
            attr_units.append(a)

        return attr_units

    def join_attr_desc(self, attribute: AttributeUnitDescription, description: str):
        attribute.description = description
        return attribute

    def join_attr_unit_type(self, attribute: list, unit: int):
        for a in attribute:
            a.unit_type = unit

        return attribute

    def join_attr_sub_theme(self, attribute: list, subtheme: int):
        for a in attribute:
            a.sub_theme = subtheme

        return attribute

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
