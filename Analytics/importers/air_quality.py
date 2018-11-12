from base import BaseImporter

API_NAME = 'AirQuality'
BASE_URL = 'http://api.erg.kcl.ac.uk/AirQuality/Annual/MonitoringObjective/GroupName=London/Year=2010/Json'
REFRESH_TIME = 5
API_KEY = None
TOKEN_EXPIRY = None

class KCLAirQuality(BaseImporter):
    def __init__(self):
        super().__init__(API_NAME, BASE_URL, REFRESH_TIME, API_KEY, TOKEN_EXPIRY)
        