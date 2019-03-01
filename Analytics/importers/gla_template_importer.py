'''
This is a template importer for Sharing Cities GLA API (https://data.london.gov.uk/api/table/9080r_yhdps)
It also serves as an example to write your own importers that have a similar structure to this.
'''

import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from importers.base import BaseImporter, Location, get_config
from models.sensor import Sensor
from models import location
from db import db
import pandas as pd
import numpy as np

### Instantiating the config.yml file and referencing the the relevant api details
config = get_config()
config = config[config['environment']]['gla_temaplate_importer']

### Assigning the api details to variables
API_NAME = config['API_NAME']
BASE_URL = config['BASE_URL']
REFRESH_TIME = config['REFRESH_TIME']
API_KEY = config['API_KEY']
TOKEN_EXPIRY = config['TOKEN_EXPIRY']
REFRESH_URL = config['REFRESH_URL']
API_CLASS = config['API_CLASS']

class GLATemplateImporter(BaseImporter):
    def __init__(self):
        super().__init__(API_NAME, BASE_URL, REFRESH_TIME, API_KEY, API_CLASS, TOKEN_EXPIRY)

    def _create_datasource(self, headers=None):

        ### _create_datasource is a method from BaseImporter that invokes requests to fetch the data from the API
        super()._create_datasource(headers)

        ### create_dataframe  will parse the json response and return the data in a tabular format (dataframe)
        ### the argument ignore_object_tags will ignore the objects that are assigned to those tags
        ### see json_reader.py for more options
        self.df  = self.create_dataframe(ignore_object_tags=['info', 'fields'])

        ### Hardcoding the location. As there is no information on the location of the sensor
        ### the centroid coordinates of Greenwich is used
        self.df['latitude'] = 51.482877
        self.df['longitude'] = -0.007516

        ### Hardcoding the description. 
        self.df['description'] = 'gla template importer'
        
        ### Faking a sensor id since the api returns data only from one sensor
        ### Need to modify it when the api starts sourcing data from more sensors
        self.df['tag'] = 'gla_template_sensor_test'

        ### The API response returns null data for some cases
        ### eg:  displayFieldName   date_time   b1_heat_value   b1_flow_value  
        ###      0  1521480600000   20  null
        ### Since, by design choice, null values are not permited in the database, the reseracher has to make a choice on how to deal with this.
        ### This could be choose a default value for nulls like -999 or, since string  values are allowed in the database, choose "null" (recommended). 
        self.df.fillna("null", inplace=True)

        ### Renaming the attribute labels for redability in the database
        self.df.rename(index=str, columns={'b1_heat_value':'b1_heat_gla', 
                        'b1_flow_value':'b1_flow_gla',
                        'b1_temp_out_value':'b1_temp_out_gla',
                        'b1_temp_back_value':'b1_temp_back_gla',
                        'b2_heat_value':'b2_heat_gla',
                        'b2_flow_value':'b2_flow_gla',
                        'b2_temp_out_value':'b2_temp_out_gla',
                        'b2_temp_back_value':'b2_temp_back_gla',
                        'b3_heat_value':'b3_heat_gla',
                        'b3_flow_value':'b3_flow_gla',
                        'b3_temp_out_value':'b3_temp_out_gla',
                        'b3_temp_back_value':'b3_temp_back_gla'}, inplace=True)

        ### Setting the api_timestamp
        self.df['date_time'] = pd.to_datetime(self.df['date_time'])
        self.df['date_time'] = self.df['date_time'].astype(np.int64)

        ### Creating the location object by wrapping the specified coordinates
        loc = Location('latitude', 'longitude')
        
        ### Passing, the dataframe as well as the relevant attributes, units, descriptionds api timestamps 
        self.create_datasource(dataframe=self.df, sensor_tag='tag', attribute_tag=['b1_heat_gla',
                                                                                  'b1_flow_gla',
                                                                                  'b1_temp_out_gla',
                                                                                  'b1_temp_back_gla',
                                                                                  'b2_heat_gla',
                                                                                  'b2_flow_gla',
                                                                                  'b2_temp_out_gla',
                                                                                  'b2_temp_back_gla',
                                                                                  'b3_heat_gla',
                                                                                  'b3_flow_gla',
                                                                                  'b3_temp_out_gla',
                                                                                  'b3_temp_back_gla'], 
                               unit_value=[],
                               bespoke_sub_theme=[], 
                               bespoke_unit_tag=[],
                               location_tag=loc,
                               description=[],
                               api_timestamp_tag='date_time',
                               sensor_prefix='',
                               is_dependent=True)

    def _refresh_token(self, *args):
        print('Token expired Refresh it manually')