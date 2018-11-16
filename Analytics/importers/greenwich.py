import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from importers.base import BaseImporter, Location, get_config
from models.sensor import Sensor
from models import location

config = get_config()
config = config['test']['greenwich_meta']

API_NAME = config['API_NAME']
BASE_URL = config['BASE_URL']
REFRESH_TIME = config['REFRESH_TIME']
API_KEY = config['API_KEY']
TOKEN_EXPIRY = config['TOKEN_EXPIRY'] # Seconds after which token would expire in this case 1 year
REFRESH_URL = config['REFRESH_URL']

class GreenwichMeta(BaseImporter):
    def __init__(self):
        super().__init__(API_NAME, BASE_URL, REFRESH_TIME, API_KEY, 'importers.greenwich.GreenwichMeta', TOKEN_EXPIRY)

    def _create_datasource(self):
        super()._create_datasource()
        self.df  = self.create_dataframe(ignore_object_tags=['fieldAliases', 'fields'])

        loc = Location('latitude', 'longitude')
        self.create_datasource(dataframe= self.df, sensor_tag='lotcode', attribute_tag=['baycount', 'baytype'], 
                                unit_value=[], bespoke_unit_tag=[], description=[], bespoke_sub_theme=[], 
                                location_tag=loc, sensor_prefix='smart_parking_', api_timestamp_tag='run_time_stamp')

    def _refresh_token(self, *args):
        print('Token expired Refresh it manually')


config = get_config()
config = config['test']['greenwich_occ']

API_NAME_OCC = config['API_NAME']
BASE_URL_OCC = config['BASE_URL']

class GreenwichOCC(BaseImporter):
    def __init__(self):
        super().__init__(API_NAME_OCC, BASE_URL_OCC, REFRESH_TIME, API_KEY, 'importers.greenwich.GreenwichOCC', TOKEN_EXPIRY)

    def _create_datasource(self):
        super()._create_datasource()
        self.df  = self.create_dataframe(ignore_object_tags=['fieldAliases', 'fields'])

        names = self.df['lotcode'].tolist()
        latitude = []
        longitude = []

        for s in names:
            _s = Sensor.get_by_name('smart_parking_' + str(s))
            _l = location.Location.get_by_id(_s.l_id)
            latitude.append(_l.lat)
            longitude.append(_l.lon)

        self.df['latitude'] = latitude
        self.df['longitude'] = longitude
        loc = Location('latitude', 'longitude')
        self.create_datasource(dataframe= self.df, sensor_tag='lotcode', attribute_tag=['free', 'isoffline', 'occupied'], 
                                unit_value=[], bespoke_unit_tag=[], description=[], bespoke_sub_theme=[], location_tag=loc,
                                sensor_prefix='smart_parking_', api_timestamp_tag='run_time_stamp')

    def _refresh_token(self, *args):
        print('Token expired Refresh it manually')