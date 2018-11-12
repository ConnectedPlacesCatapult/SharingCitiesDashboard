import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from importers.base import BaseImporter, Location


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
API_KEY = 'm-N8ho-0WD3lCrZ5KjSFDFBUEp6McF4-u945j-YVqZ6K3f9Q6cCjP7gTeHRZjNza'
TOKEN_EXPIRY = '01/01/2019 00:00:00' # Seconds after which token would expire in this case 1 year
URL = BASE_URL + API_KEY

class GreenwichMeta(BaseImporter):
    def __init__(self):
        super().__init__(API_NAME, URL, REFRESH_TIME, API_KEY, TOKEN_EXPIRY)

    def _create_datasource(self):
        self.df  = self.create_dataframe(ignore_object_tags=['fieldAliases', 'fields'])

        loc = Location('latitude', 'longitude')
        self.create_datasource(dataframe= self.df, sensor_tag='street', attribute_tag=['baycount', 'baytype'], 
                                unit_value=[], bespoke_unit_tag=[], description=[], bespoke_sub_theme=[], location_tag=loc)


API_NAME_OCC = 'Greenwich_SmartParking_OCC'
BASE_URL_OCC = 'https://maps.london.gov.uk/gla/rest/services/apps/smart_parking_demo_service_01/\
                MapServer/1/query?where=1%3D1&text=&objectIds=&time=&geometry=\
                &geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects\
                &relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false\
                &maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false\
                &returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=\
                &outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false\
                &resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false\
                &datumTransformation=&parameterValues=&rangeValues=&f=pjson&token='
URL_OCC = BASE_URL_OCC + API_KEY
class GreenwichOCC(BaseImporter):
    def __init__(self):
        super().__init__(API_NAME_OCC, URL_OCC, REFRESH_TIME, API_KEY, TOKEN_EXPIRY)