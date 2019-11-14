# Backend Architecture

In this section the core backend structure of SharingCities Dashboard is described. This include the database and backend server.

## Database structure 
At the very core of backend implementation of SharingCities Dashboard there is a Postgres/Postgis database holding the metadata related to the endpoint APIs the sensors and their attributes, the sourced data as well as dashboard related housekeeping data. 

![](../images/scd-metadata.png)

A functionality description for each table is given below:

Table name | Description 
--- | --- 
*layouts* | This table stores the position and dimensions of each widget. It also contains a flag indicating weather the widget is static (on off visualisation) or dynamic (updated whenever new data are imported).
1 | 2 


#### layouts 
This table stores the position and dimensions of each widget. It also contains a flag indicating weather the widget is static (on off visualisation) or dynamic (updated whenever new data are imported).

#### widgets 
This table stores the widgets specifications for each user and each layout. It shares a relationship with ``` layouts ``` table.

#### users
 This table stores the login credentials for each dashboard user.  

#### predictionresults
This table stores the forecasting specifications and results for each user's forecasting job. Along with predicted values, this table stores information related to the mean absolute percentage error (MAPE) as well as the 95% confidence intervals of predictions.

#### userpredictions 
This table stores the association between users and prediction requests for a specific attribute. Prediction IDs are generated every time a user requests a forecast.

#### theme 
This table is storing the general theme for the data source (e.g. Environment). This is the first level of categorisation in the dashboard. Themes need to be specified during data import.

#### subtheme 
This table is storing a more specific subset of theme (e.g. Air Quality). This is the second level of categorisation in the dashboard. Similar to themes, these need to be specified for each attribute during at an importer level.

#### unit 
This table is storing the units of measurement for each attribute (e.g. kg, ppm etc.). The units of measurement need to be specified at the importer level. 

#### tracker
This table is used for storing moving sensor metadata. Currently this table reflects a requirement for storing GPS enabled shared bikes.

#### location_data
Table storing moving sensor GPS data (e.g. coordinates, satellite fix, number of effective satellites etc.).

#### attributes
 Table storing all attributes, associated metadata and reference data value tables using unique identifiers. In this implementation, this table acts as a catalog linking the metadata structure with the value tables. 

#### api
Table storing API endopoints and specifications. This table is also used by the scheduler to coordinate data imports.

#### location
Table storing sensor locations as geometry objects. 

#### sensor 
This table is links the sensors with their corresponding APIs and locations. A sensor in this context is a physical entity transmitting data (e.g. air quality sensor, parking sensor etc.), however abstract entities (e.g. an LSOA polygon) can also be incorporated within this context.

#### attribute_range 
This table is storing the minimum and maximum values of an attribute as well as their corresponding sensor IDs and recorded dates. It is used by the frontend to equalise the scales of plot widgets.

#### sensorattribute 
This table stores the many-to-many relationship between sensors and attributes. 

#### value_tables
Individual value tables for each attribute are stored in the database as separate tables and are referenced using the ``` table_name ``` column in **attributes** table. The uniqueness of each table name is guaranteed by a combination of attribute name and a unique identifier. Each data table has the following columns:

- **s_id** 
    The ID of a particular sensor.

- **value** 
    The sensor value.

- **api_timestamp**
    The timestamp reported by the sensor. This could correspond to the time the sensor was queried or the last time the sensor reported a change in value.

- **timestamp** 
    The time the value was imported in the database.

## Backend implementation 

SharingCitiesDashboard backend is written in Flask and the ORM model used to interact with the database is SQLAlchemy. The following sections describe the supported GET and POST API requests.

## API structure 

### GET requests
The main API GET requests that are served can be categorised to requests related to themes (and subthemes) requests related to sensors, requests related to attributes and requests related to values.

#### Request for theme
This request parses the database for attribute themes data and subthemes and returns subtheme data associated with a specific **theme** ID, or attribute data associated with a **subtheme** ID. 

- ```0.0.0.0:5000/theme?theme=1```

```json
[
    {
        "id": 1,
        "Theme id": 1,
        "Name": "Airquality"
    }
]
```

- ```0.0.0.0:5000/theme?subtheme=1```

```json
[
    {
        "id": "446dda99-13b3-476f-a5c3-b5e2fa49ad31",
        "name": "CO",
        "table_name": "CO_3eaa1e14_369f_4275_aec6_a9dd9f71e5bd",
        "Sub Theme id": 1,
        "Unit": 1,
        "Unit Value": "1",
        "Description": "No Description"
    },
    ...
```

#### Request for sensors
This request is retrieving sensor data from database. It accepts an ID of **sensor**, the sensor name, or the ID of an attribute  associated with that sensor and returns its details. It also accepts a value 'all' which would return all the sensor in the system. Comma seperated sensor names retrieves multiple sensor records.

- ```0.0.0.0:5000/sensor?sensor=all```

```json
[
    {
        "id": "f4dd2dbe-f1bc-4a66-858d-d5a0c04e5d77",
        "name": "baycount",
        "table_name": "baycount_ac304fe6_4aff_46a5_a551_e98f2c27c6a1",
        "Sub Theme id": 1,
        "Unit": 1,
        "Unit Value": "None",
        "Description": "No Description"
    },
    ...
```
#### Request for attributes
This request retrieves attribute data from database. For attribute metadata,the relevant parameter is the name of **attribute**. Parameter **attributedata** can be used if the user wishes to retrieve the relevant data of an attribute. For additional optional parameters please consult the codebase.

-  ```0.0.0.0:5000/attribute?attribute=CO```

```json
[
    {
        "id": "8c7d53b9-fc6c-435f-8116-077b3bcf8e18",
        "name": "CO",
        "table_name": "CO_3eaa1e14_369f_4275_aec6_a9dd9f71e5bd",
        "Sub Theme id": 1,
        "Unit": 1,
        "Unit Value": "1",
        "Description": "No Description"
    }
]
```

- ```0.0.0.0:5000/attribute?attributedata=CO```

```json
[
    {
        "Attribute_Table": "CO_3eaa1e14_369f_4275_aec6_a9dd9f71e5bd",
        "Attribute_Name": "CO",
        "Attribute_Description": "No Description",
        "Attribute_Unit_Value": "1",
        "Total_Records": 16,
        "Attribute_Values": [
            {
                "Sensor_id": "82b67cec-751d-4ac5-b2e5-cdd93adafb10",
                "Value": "0.1",
                "Timestamp": "2019-10-20 23:00:00"
            },
            ...

```

#### Request for data

This request retrieves and formats data from the database. In addition to all query parameters specified in the requests described above, it accepts the parameter **grouped**, **harmonising_method** and **per_sensor**. Note that the parameter **attributedata** has to be specified in this request. The parameter **grouped** can be used to enforce an hourly grouping of the sensor data to allow more straighforward evaluation of their values. Parameter **per_sensor** can be used to specify whether the sensor records are to be grouped at hourly intervals per individual sensor. Defaults to False. **harmonising_method** harmonises all attributes in the query to match the attribute with the most records. It also reformats the data to be structured as long (row stacked) or wide (column stacked).

- ```0.0.0.0:5000/data?grouped=true&attributedata=CO,NO2```

```json
[
    {
        "Timestamp": 1571637600000,
        "Attribute_Name": "CO",
        "Attribute_Table": "CO_3eaa1e14_369f_4275_aec6_a9dd9f71e5bd",
        "Sensor_id": "82b67cec-751d-4ac5-b2e5-cdd93adafb10",
        "Value": "0.1",
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
    },
    {
        "Timestamp": 1571637600000,
        "Attribute_Name": "NO2",
        "Attribute_Table": "NO2_e42c8dd7_ca57_4eb4_8bab_b5c77baeb55b",
        "Sensor_id": "97357ae5-ac87-458f-9c37-65ab389b567a",
        "Value": "18.4",
        "Name": "ST5",
        "Latitude": 51.3892869045,
        "Longitude": -0.1416615248
    },
    ...

```

- ```0.0.0.0:5000/data?grouped=true&harmonising_method=wide&attributedata=CO,O3```

```json
[
    {
        "Latitude,CO": 51.5217933738,
        "Latitude,O3": 51.480315978,
        "Longitude,CO": -0.1840410698,
        "Longitude,O3": 0.1610781191,
        "Value,CO": 0.1,
        "Value,O3": 55.05,
        "timestamp,CO": 1571634000000,
        "timestamp,O3": 1571634000000
    },
    {
        "Latitude,CO": 51.5217933738,
        "Latitude,O3": 51.4965102403,
        "Longitude,CO": -0.1840410698,
        "Longitude,O3": -0.0562744811,
        "Value,CO": 0.15,
        "Value,O3": 42.3307692308,
        "timestamp,CO": 1571637600000,
        "timestamp,O3": 1571637600000
    }
    ...

```

### POST requests
