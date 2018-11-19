from importers.base import BaseImporter, Location, get_config


config = get_config()
config = config['test']['air_quality']

API_NAME = config['API_NAME']
BASE_URL = config['BASE_URL']
REFRESH_TIME = config['REFRESH_TIME']
API_KEY = config['API_KEY']
TOKEN_EXPIRY = config['TOKEN_EXPIRY']
API_CLASS = config['API_CLASS']

class KCLAirQuality(BaseImporter):
    def __init__(self):
        super().__init__(API_NAME, BASE_URL, REFRESH_TIME, API_KEY, API_CLASS, TOKEN_EXPIRY)

    def _create_datasource(self):
        super()._create_datasource()
        self.df = self.create_dataframe(object_separator='@SiteCode')
        # self.df.to_csv('/Users/hemanshu/Desktop/kcl.csv', index=False)
        

        self.create_datasource_with_values(dataframe=self.df, sensor_tag='@SiteCode', attribute_tag='@SpeciesCode', 
                                            value_tag='@Value', latitude_tag='@Latitude', longitude_tag='@Longitude',
                                            description_tag='@SpeciesDescription', unit_value_tag='@ObjectiveName')
        