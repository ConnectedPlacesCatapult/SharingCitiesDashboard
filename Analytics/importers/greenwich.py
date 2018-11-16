import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from importers.base import BaseImporter, Location
from models.sensor import Sensor
from models import location
from importers.api_keys import GREENWICH_API_KEY


API_NAME = 'Greenwich_SmartParking_Meta'
BASE_URL = ('https://maps.london.gov.uk/gla/rest/services/apps/' + 
            'smart_parking_demo_service_01/MapServer/0/query?where=1%3D1&text=' +
            '&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope' +
            '&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=' +
            '&outFields=*&returnGeometry=true&returnTrueCurves=false' +
            '&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false' +
            '&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=' +
            '&outStatistics=&returnZ=false&returnM=false&gdbVersion=' +
            '&returnDistinctValues=false&resultOffset=&resultRecordCount=' +
            '&queryByDistance=&returnExtentsOnly=false&datumTransformation=' +
            '&parameterValues=&rangeValues=&f=pjson&token=')
REFRESH_TIME = 20
TOKEN_EXPIRY = '01/01/2019 00:00:00' # Seconds after which token would expire in this case 1 year
REFRESH_URL = 'https://maps.london.gov.uk/gla/tokens/generateToken'

class GreenwichMeta(BaseImporter):
    def __init__(self):
        super().__init__(API_NAME, BASE_URL, REFRESH_TIME, GREENWICH_API_KEY, 'importers.greenwich.GreenwichMeta', TOKEN_EXPIRY)

    def _create_datasource(self):
        super()._create_datasource()
        self.df  = self.create_dataframe(ignore_object_tags=['fieldAliases', 'fields'])

        loc = Location('latitude', 'longitude')
        self.create_datasource(dataframe= self.df, sensor_tag='lotcode', attribute_tag=['baycount', 'baytype'], 
                                unit_value=[], bespoke_unit_tag=[], description=[], bespoke_sub_theme=[], 
                                location_tag=loc, sensor_prefix='smart_parking_', api_timestamp_tag='run_time_stamp')

    def _refresh_token(self, *args):
        print('Token expired Refresh it manually')


API_NAME_OCC = 'Greenwich_SmartParking_OCC'
BASE_URL_OCC = ('https://maps.london.gov.uk/gla/rest/services/apps/smart_parking_demo_service_01/MapServer/1/query?' +
                'where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=' +
                '&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true' +
                '&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false' +
                '&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false' +
                '&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=' +
                '&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pjson&token=')
class GreenwichOCC(BaseImporter):
    def __init__(self):
        super().__init__(API_NAME_OCC, BASE_URL_OCC, REFRESH_TIME, GREENWICH_API_KEY, 'importers.greenwich.GreenwichOCC', TOKEN_EXPIRY)

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