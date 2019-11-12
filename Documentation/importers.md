# Importers
Within the context of SharingCitiesDashboard, importers are the means of adding a particular data source in the system as well as populating the database with values. New importers inherit from a base class containing methods that allow the user to specify the theme, subtheme, sensors, attributes and values of a data source, and save these in the database ensuring that there are no conflicts/duplicates. Sensitive importer specification is provided by the user using the importer specifications yaml file:

```bash
 api_endpoints:
  air_quality:
    API_CLASS: importers.air_quality.KCLAirQuality
    API_KEY: ''
    API_NAME: Air_Quality_KCL
    BASE_URL: YOUR_URL
    REFRESH_TIME: 3600
    REFRESH_URL: null
    TOKEN_EXPIRY: null
```

In the example above, the user importer class is named ```KCLAirQuality``` located under ```air_quality```. More information related to importer use can be found here.  

### Pre-build importers
Presently, there are pre-build importers for the following two cities: Greenwich and Milan.
