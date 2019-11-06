# Backend Architecture

In this section the core backend structure of SharingCities Dashboard is described. This include the database and backend server.

## Database structure 
At the very core of backend implementation of SharingCities Dashboard there is a Postgres/Postgis database holding the metadata related to the endpoint APIs the sensors and their attributes, the sourced data as well as dashboard related housekeeping data. 

![](../images/scd-metadata.png)

A functionality description for each table is given below:

### layouts 
**layouts**  table stores the position and dimensions of each widget. It also contains a flag indicating weather the widget is static (on off visualisation) or dynamic (updated whenever new data are imported).

### widgets 
**widgets** table stores the widgets specifications for each user and each layout. It shares a relationship with ``` layouts ``` table.

### users
 **users** This table stores the login credentials for each dashboard user.  

### predictionresults
 **predictionresults** This table stores the forecasting specifications and results for each user's forecasting job. Along with predicted values, this table stores information related to the mean absolute percentage error (MAPE) as well as the 95% confidence intervals of predictions.

### userpredictions 
 **userpredictions** This table stores the association between users and prediction requests for a specific attribute. Prediction IDs are generated every time a user requests a forecast.

### theme 
**theme** This table is storing the general theme for the data source (e.g. Environment). This is the first level of categorisation in the dashboard. Themes need to be specified during data import.

### subtheme 
**subtheme** This table is storing a more specific subset of theme (e.g. Air Quality). This is the second level of categorisation in the dashboard. Similar to themes, these need to be specified for each attribute during at an importer level.

### unit 
**unit** This table is storing the units of measurement for each attribute (e.g. kg, ppm etc.). The units of measurement need to be specified at the importer level. 

### tracker
**tracker** This table is used for storing moving sensor metadata. Currently this table reflects a requirement for storing GPS enabled shared bikes.

### location_data
 **location_data** Table storing moving sensor GPS data (e.g. coordinates, satellite fix, number of effective satellites etc.).

### attributes
 **attributes** Table storing all attributes, associated metadata and reference data value tables using unique identifiers. In this implementation, this table acts as a catalog linking the metadata structure with the value tables. 

### api
**api** Table storing API endopoints and specifications. 

### location
**location** Table storing sensor locations as geometry objects. 

### sensor 
**sensor** This table is links the sensors with their corresponding APIs and locations. A sensor in this context is a physical entity transmitting data (e.g. air quality sensor, parking sensor etc.), however abstract entities (e.g. an LSOA polygon) can also be incorporated within this context.

### attribute_range 
**attribute_range** This table is storing the minimum and maximum values of an attribute as well as their corresponding sensor IDs and recorded dates. It is used by the frontend to equalise the scales of plot widgets.

In addition, the many-to-many relationship between sensors and attributes is stored in a separate table *sensorattribute*. Individual value tables for each attribute are stored in the database as separate tables and are referenced using the ``` table_name ``` column in **attributes** table. The uniqueness of each table is guaranteed by a combination of name and unique identifier. Each data table has the following columns:

- **s_id** 
    The ID of a particular sensor.

- **value** 
    The sensor value.

- **api_timestamp**
    The timestamp reported by the sensor. This could correspond to the time the sensor was queried or the last time the sensor reported a change in value.

- **timestamp** 
    The time the value was imported in the database.

## Backend structure 


