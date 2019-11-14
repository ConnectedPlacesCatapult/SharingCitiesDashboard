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
Presently, there are pre-build importers for the following two cities: Greenwich and Milan. For Lisbon, an importer using test data for *GiraStation* is created as a proof of concept.

#### Greenwich
SharingCities Dashboard Greenwich importers were created using a dedicated ArcGIS REST API Services Directory which was provided as a proof of concept to source the following datasets:

* Smart parking stations with various attributes (coordinates, street name, parking type etc.). Historical occupation data for these stations were also provided with various attributes (availability, status etc.). Currently there are two implementations, a test one referring to stations located in Oxford, and a live one referring to stations in Greenwich. 

API/data sample name | Description | Importer | Status | Endpoint 
--- | --- | --- | --- | ---
Greenwich smart parking metadata | Location and metadata relating to each parking Lot, each Lot contains a number of parking bays. There are 20 Lots and 46 bays in total. Data table is updated (truncated) each time the api is called | Live  | https://maps.london.gov.uk/gla/rest/services/apps/smart_parking_demo_service_01/MapServer/7/

