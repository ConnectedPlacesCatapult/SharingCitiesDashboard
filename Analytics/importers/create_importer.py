import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from base import BaseImporter
from datetime import datetime
import os, uuid
import json
from app import create_app
from importers.attr_unit_desc import AttributeUnitDescription
from models.unit import Unit
from models.theme import Theme, SubTheme
# from models.models import sensor_attribute
from read_json import ReadJson
from models.attributes import Attributes
from models.sensor_attribute import SensorAttribute
from db import db

class CreateImporter(object):
    def __init__(self):
        self.terminal_width = os.get_terminal_size().columns
        self.application = create_app()
        
    def builder(self):
        attribute_data = [] # It contains a list of AttributeUnitDescription
        self._print_in_middle(Statuses.BUILD_IMPORTER)

        data_source, base_importer = self.load_show_dataset()
        saved_sensors_ids = self.create_sensors(data_source, base_importer)
        attr_as_dict, unit_as_dict, desc_as_dict = self.input_for_attributes(data_source, base_importer)

        # make attributes and units flat to display
        flat_attr = self.flat_attributes(attr_as_dict)
        flat_units = self.flat_units(unit_as_dict)        
        
        # Merge units with attributes
        self.merge_units_attributes(flat_attr, flat_units, attribute_data)
        
        # Flat descriptions and merge them with attributes
        flat_desc = self.flat_description(desc_as_dict)
        self.merge_attributes_description(flat_desc, base_importer, attribute_data)

        self.merge_units(attribute_data, base_importer)
        self.merge_subthemes(attribute_data, base_importer)

        attr_to_sensor_mapping = self.map_sensor_to_attribute(base_importer)
        self.attribute_to_commit(attribute_data)

        self.stage_attribute_sensor_relation(attribute_data, attr_to_sensor_mapping)

        self.commit(base_importer)

    def load_show_dataset(self):
        '''
        Section for saving API
        '''
        data_source = {}
        a_questions = APIQuestions()
        self.question_generator(a_questions, data_source)

        base_importer = self.load_dataset(data_source[APIQuestions._1_API_NAME], data_source[APIQuestions._2_API_URL], 
                                    data_source[APIQuestions._3_API_REFRESH_TIME], data_source[APIQuestions._4_API_KEY], 
                                    data_source[APIQuestions._5_API_TOKEN_EXPIRY])
        self._print_dataset(base_importer.dataset)
        return data_source, base_importer

    def create_sensors(self, data_source, base_importer):
        '''
        Section for Saving Sensors
        '''
        s_questions = SensorQuestions()
        self.question_generator(s_questions, data_source)

        _location = data_source[SensorQuestions._8_SENSOR_LOCATION_TAG_NAMES].split()
        lat = lon = None
        if len(_location) > 1:
            lat, lon = _location

        self._print_in_middle(Statuses.STAGING_SENSOR)
        self._print_in_middle(Statuses.SUMMARY)
        self._print_dict(data_source)
        self._questions(Statuses.SAVE_SENSOR)
        save_sensor = input()

        # Need to also check what if the input is No aur N
        saved_sensors_ids = {}
        if save_sensor == 'y' or save_sensor == 'Y':
            saved_sensors_ids = base_importer.sensors(data_source[SensorQuestions._6_SENSOR_TAG_NAME], 
                                    [lat, lon],
                                    True if data_source[SensorQuestions._7_USE_VALUE_OF_TAG_AS_SENSOR_NAME] == 'Y' \
                                    or data_source[SensorQuestions._7_USE_VALUE_OF_TAG_AS_SENSOR_NAME] == 'y' \
                                    else False)

            self._print_in_middle(Statuses.SENSOR_SAVED)
        else:
            # What if user presses N or n or any other letter
            pass
        return saved_sensors_ids

    def input_for_attributes(self, data_source, base_importer):
        '''
        Start building the attributes and linking them as well
        '''
        self._print_in_middle(Statuses.ATTRIBUTE)
        attr_questions = AttributeQuestions()
        self.question_generator(attr_questions, data_source)

        selected_attributes = data_source[AttributeQuestions._1_ATTRIBUTE_TAG_NAMES].split()
        selected_units = data_source[AttributeQuestions._3_UNIT_TAG_NAMES].split()
        selected_desc = data_source[AttributeQuestions._5_DESCRIPTION_TAG_NAMES].split()

        # Get attributes, units, description as dictionaries 
        attr_as_dict = base_importer.attributes(selected_attributes)
        unit_as_dict = base_importer.units(selected_units)
        desc_as_dict = base_importer.descriptions(selected_desc)

        return attr_as_dict, unit_as_dict, desc_as_dict

    def flat_attributes(self, attr_as_dict):
        self._print_in_middle('\nAttributes')
        flat_attr = []
        a_index = 0
        for attr in attr_as_dict:
            for value in attr_as_dict[attr]:
                flat_attr.append(value)
                print(str(a_index) + '.', value)
                a_index += 1
        return flat_attr

    def flat_units(self, unit_as_dict):
        self._print_in_middle('\nUnits')
        flat_units = []
        f_index = 0
        for unit in unit_as_dict:
            for value in unit_as_dict[unit]:
                flat_units.append(value)
                print(str(f_index) + '.', value)
                f_index += 1

        return flat_units

    def merge_units_attributes(self, flat_attr, flat_units, attribute_data):
        self._print_in_middle(Statuses.CHOOSE_UNIT)
        for attr in flat_attr:
            print(attr + ': ', end='')
            units_for_attr = input().split()
            for unit in units_for_attr:
                a = base_importer.join_attr_unit(attr, flat_units[int(unit)])
                attribute_data.append(a)

    def flat_description(self, desc_as_dict):
        self._print_in_middle('\nDescriptions')
        flat_desc = []
        d_index = 0
        for d in desc_as_dict:
            for value in desc_as_dict[d]:
                flat_desc.append(value)
                print(str(d_index) + '.', value )
                d_index +=1
        return flat_desc

    def merge_attributes_description(self, flat_desc, base_importer, attribute_data):
        self._print_attribute_data(attribute_data)
        self._print_in_middle(Statuses.CHOOSE_DESC)
        for d in flat_desc:
            print(d, ':', end='')
            attr_unit = input().split()
            for au in attr_unit:
                base_importer.join_attr_desc(attribute_data[int(au)], d)

    def merge_units(self, attribute_data, base_importer):
        # Fetch units from database
        self._print_in_middle('\nUnits available in Database')
        units = Unit.get()
        # show units
        for unit in range(len(units)):
            print(str(unit) + '.', units[unit]._type)

        self._questions('Does the listed units contains all the respective units for this dataset: (Y/N) ')
        unit_available = input()
        if unit_available == 'y' or unit_available == 'Y':
            # This is repetition of code from above
            self._print_in_middle('\nAttributes and their respective Unit Values')
            self._print_attribute_data(attribute_data)

            self._questions(Statuses.CHOOSE_UNIT_ID, end='\n')

            for unit in range(len(units)):
                print(units[int(unit)]._type + ':', end='')
                attr_unit_ids = input().split()
                base_importer.join_attr_unit_type([attribute_data[int(i)] for i in attr_unit_ids], 
                                                    units[int(unit)].id)

        else:
            # Need to give user an option here to create new Units for their datasets
            pass

    def merge_subthemes(self, attribute_data, base_importer):
        # Fetch sub themes from database
        self._print_in_middle('\nSubTheme available in Database')
        sub_themes = SubTheme.get_all()
        # Show Sub Themes
        for theme in range(len(sub_themes)):
            print(str(theme) + '.', sub_themes[theme].name)

        self._questions('Does the listed SubThemes contains all the respective themes for this dataset: (Y/N) ')
        st_available = input()
        if st_available == 'y' or st_available == 'Y':
            # This is repetition of code from above, repeating 3rd time
            self._print_in_middle('\nAttributes and their respective Unit Values')
            self._print_attribute_data(attribute_data)

            self._questions(Statuses.CHOOSE_SUB_THEME, end='\n')
            for theme in range(len(sub_themes)):
                print(sub_themes[theme].name + ':', end='')
                attr_theme_ids = input().split()
                base_importer.join_attr_sub_theme([attribute_data[int(i)] for i in attr_theme_ids],
                                                    sub_themes[theme].id)
        else:
            # Need to give user an option to be able create new sub theme and themes if necessary
            pass

    def map_sensor_to_attribute(self, base_importer):
        self._questions('Are attributes at the same level or a level below sensor tag: (Y/N) ')
        attr_at_level = input()
        self._questions('Enter Tag name of the first object: ')
        root_tag = input()
        attr_to_sensor_mapping = {}
        if attr_at_level == 'y' or attr_at_level == 'Y':
            r_json = ReadJson(None, None)
            r_json.map_sensors_to_attributes(base_importer.dataset, '@SiteCode', '@SpeciesCode', 
                                            attr_to_sensor_mapping, root_tag)
            # print(values)
        else:
            # Need to loop through every sensor and map attributes manually to them
            pass

        return attr_to_sensor_mapping

    def attribute_to_commit(self, attribute_data):
        # Stage Attribute commit
        for attr in attribute_data:
            a = Attributes(name=attr.attribute, sub_theme=attr.sub_theme, table_name=str(uuid.uuid4()), unit_value=attr.unit_value, description=attr.description, unit=attr.unit_type)
            a.save()
            attr.id = a.id
        
        self._print_in_middle('Saved Attributes')

    def stage_attribute_sensor_relation(self, attribute_data, attr_to_sensor_mapping):
        self._print_in_middle('Saving Sensor to Attributes relation')

        '''
        Map attributes to sensors
        '''
        for key in attr_to_sensor_mapping:
            for value in attr_to_sensor_mapping[key]:
                sensor_id = saved_sensors_ids[key]
                for attr in attribute_data:
                    if attr.attribute == value:
                        a = SensorAttribute(sensor_id, attr.id)
                        a.save()

    def commit(self, base_importer):
        base_importer.commit()
        self._print_in_middle('Saved Attribute to Sensor Relation')
        
    def question_generator(self, obj, data_source):
        for q in dir(obj):
            if not q.startswith('__'):
                t = getattr(obj, q)
                self._questions(t)
                data_source[t] = input()

    def _questions(self, q, end=''):
        print(Colors.BOLD, Colors.OKGREEN, q, Colors.ENDC, end=end)

    def load_dataset(self, name, url, refresh_time, api_key, token_expiry):
        b = BaseImporter(name, url, refresh_time, api_key, token_expiry)
        return b

    def _print_attribute_data(self, attribute_data):
        self._print_in_middle('\nAttributes and their respective Unit Values')
        for attr in range(len(attribute_data)):
            print(str(attr) + '. ', Colors.OKGREEN, 'Attribute Name: ', Colors.ENDC, attribute_data[attr].attribute, 
                    Colors.OKGREEN, ', Unit Value: ', Colors.ENDC, attribute_data[attr].unit_value)

    def _print_dataset(self, dataset):
        _print = json.dumps(dataset, indent=2)
        count = 0
        to_show = ''
        self._print_in_box()
        for s in _print:
            to_show += s
            if s == '\n':
                count += 1

            if count == 20:
                print(to_show)
                to_show = ''
                count = 0
                self._questions(Statuses.SHOW_MORE_DATA)
                _next = input()
                if _next != 'Y' and _next != 'y':
                    break

        self._print_in_box()

    def _print_in_box(self):
        for i in range(self.terminal_width//2):
            print(Colors.OKBLUE , '#', end='')
        print(Colors.ENDC)

    def _print_in_middle(self, v):
        print(Colors.BOLD, Colors.HEADER, v.center(self.terminal_width), Colors.ENDC)

    def _print_dict(self, d):
        self._print_in_box()

        for k in d:
            print(Colors.BOLD, k, Colors.FAIL, d[k], Colors.ENDC)

        self._print_in_box()


class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class Statuses:
    SUMMARY = 'Summary'
    STAGING_SENSOR = 'Staging API and Sensor for Commit'
    BUILD_IMPORTER = 'Importer Builder'
    SHOW_MORE_DATA = 'Would you like to see next 20 lines (Y/N): '
    SAVE_SENSOR = 'Create Sensors in system (Y/N): '
    SENSOR_SAVED = 'Sensor data has been saved'
    ATTRIBUTE = 'Section for Adding Attributes'
    CHOOSE_UNIT = 'For each attribute put IDs of unit shown (space seperated) on the left of unit'
    CHOOSE_DESC = 'For each description put IDs of each Attribute and Unit combination'
    CHOOSE_UNIT_ID = 'For each unit put IDs (space seperated) of each of the Attribute'
    CHOOSE_SUB_THEME = 'For each sub theme put IDs (space seperated) for each of the Attribute'

class APIQuestions:
    _1_API_NAME = 'Enter API Name: '
    _2_API_URL = 'Enter API URL: '
    _3_API_REFRESH_TIME = 'Enter API Refresh Time in seconds: '
    _4_API_KEY = 'Enter API Key: '
    _5_API_TOKEN_EXPIRY = 'Enter token expiry in Date format e.g DD/MM/YYY HH:MM:SS : '

class SensorQuestions:
    _6_SENSOR_TAG_NAME = 'Provide Tag Name for Sensor: '
    _7_USE_VALUE_OF_TAG_AS_SENSOR_NAME = 'Use value of the Tag as Sensor Name: (Y/N) '
    _8_SENSOR_LOCATION_TAG_NAMES = 'Enter tag names for location of Sensor space seperated: '

class AttributeQuestions:
    _1_ATTRIBUTE_TAG_NAMES = 'Enter Attribute Tag names as space seperated list: '
    _2_USE_VALUE_OF_TAG_AS_ATTRIBUTE_NAME = 'Use value of the Tag as Attribute Name: (Y/N) '
    _3_UNIT_TAG_NAMES = 'Enter Unit tag names as space seperated list: '
    _4_USE_VALUE_OF_TAG_AS_UNIT_VALUE = 'Use value of the Tag as Unit value: (Y/N) '
    _5_DESCRIPTION_TAG_NAMES = 'Enter Description Tag names as space seperated list: '
    _6_USE_VALUE_OF_TAG_AS_DESC_VALUE = 'Use value of the Tag as Description: (Y/N): '
    # _7_UNIT_IN_DATABASE = 'Does the listed units contains all the respective units for this dataset: (Y/N) '

def test_submit():
    u = Unit('kg', 'Kilogram')
    u2 = Unit('g', 'Grams')
    u3 = Unit('km', 'KiloMeter')
    u.save()
    u2.save()
    u3.save()

    t = Theme('Environment')
    t2 = Theme('Transport')
    t.save()
    t2.save()

    st = SubTheme(t.id, 'Airquality')
    st2 = SubTheme(t2.id, 'Traffic')
    st.save()
    st2.save()

    db.session.commit()



if __name__ == '__main__':
    args = sys.argv[1:]
    c = CreateImporter()
    if args[0] == 'init':
        print('Adding Initial Values')
        test_submit()
    c.builder()