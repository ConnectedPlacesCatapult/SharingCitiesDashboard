import json
import logging
from typing import Any

import geojson
import numpy as np
import pandas as pd
import shapely.wkt
from geoalchemy2.shape import to_shape

from models.location import Location
from models.sensor import Sensor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def data_geojson(df: pd.DataFrame) -> geojson.FeatureCollection:
    """
    Creates a geojson by loading the wkt geometry
    :param df: DataFrame populated with Attribute Data
    :return: Geojson formatted attribute data
    """
    features = []
    insert_features = lambda X: features.append(
        geojson.Feature(geometry=shapely.wkt.loads(X["wkt_geom"]),
                        properties=dict(Attribute_Name=X["Attribute_Name"],
                                        Value=X["Value"],
                                        Name=X["Name"])))
    df.apply(insert_features, axis=1)
    return geojson.FeatureCollection(features)


def request_grouped_data(data: {str: Any}, per_sensor: bool, freq: str,
                         method: str) -> {str: Any}:
    """
    Get grouped sensor data with different temporal frequencies by grouping at
    at hourly intervals. The grouping is based on the median of all sensor
    values that fall within the hourly interval for the following reasons:

    a) The purpose of this function is to provide the frontend with a convenient
       form of visualising the data. as such, it is not used in any subsequent
       analytics
    b) Median is more robust to outliers and Median preserves the original
       data type format.

    :param data: Attribute data in json format
    :param per_sensor: A boolean flag of whether the reformatted request
                       returns data per individual sensor or per attribute
    :param freq: temporal frequency of aggregation 'W', '1D', '1H', '1Min'
    :param method: Harmonises attributes relative to the one with the higher
           frequency and delivers the data either on a long/wide format or a
           geojson
    :return: Requested data grouped by frequency and method
    """
    try:
        df = pd.read_json(json.dumps(data), orient='records')
        harm_df = pd.DataFrame(columns=['Attribute_Name', 'Attribute_Table',
                                        'Sensor_id', 'Timestamp', 'Value'])
        # Get the attributes
        for attribute in range(len(df)):
            attr = df.iloc[attribute].Attribute_Name
            attr_table = df.iloc[attribute].Attribute_Table
            attr_values = df.iloc[attribute].Attribute_Values

            harm_df_temp = pd.DataFrame(
                columns=['Attribute_Name', 'Attribute_Table',
                         'Sensor_id', 'Timestamp', 'Value'])

            harm_df_temp['Attribute_Name'] = [attr for i in
                                              range(len(attr_values))]
            harm_df_temp['Attribute_Table'] = [attr_table for i in
                                               range(len(attr_values))]

            harm_df_temp['Sensor_id'] = [i['Sensor_id'] for i in attr_values]
            harm_df_temp['Timestamp'] = [i['Timestamp'] for i in attr_values]
            harm_df_temp['Value'] = [i['Value'] for i in attr_values]

            # append to dataframe
            harm_df = harm_df.append(harm_df_temp, ignore_index=True)

            # set datetime index
            harm_df['Timestamp'] = pd.to_datetime(harm_df['Timestamp'])
            harm_df = harm_df.set_index('Timestamp')

            try:
                # If Attributes with non-numeric values are provided a TypeError
                # will be raised
                # Related to issue #109
                harm_df.Value = harm_df.Value.astype(float)
            except TypeError as te:
                logger.log(logging.CRITICAL, "non-numeric attributes provided")

            if not per_sensor:
                if method == 'median':
                    harm_df = harm_df.groupby(
                        [pd.Grouper(freq=freq), 'Attribute_Name']).median()
                elif method == 'min':
                    harm_df = harm_df.groupby(
                        [pd.Grouper(freq=freq), 'Attribute_Name']).min()
                elif method == 'max':
                    harm_df = harm_df.groupby(
                        [pd.Grouper(freq=freq), 'Attribute_Name']).max()
                else:
                    harm_df = harm_df.groupby(
                        [pd.Grouper(freq=freq), 'Attribute_Name']).mean()
                harm_df.reset_index(inplace=True)
                _harm_df = pd.DataFrame(columns=harm_df.columns)
                for i in harm_df.Attribute_Name.unique():
                    temp = harm_df[harm_df.Attribute_Name == i]
                    temp['Timestamp'] = pd.to_datetime(temp['Timestamp'])
                    temp = temp.set_index('Timestamp')
                    temp = temp.resample(freq).ffill()
                    _harm_df = _harm_df.append(temp)
            else:
                if method == 'median':
                    harm_df = harm_df.groupby(
                        [pd.Grouper(freq=freq), 'Attribute_Name',
                         'Sensor_id']).median()
                    harm_df.reset_index(inplace=True)
                elif method == 'min':
                    harm_df = harm_df.groupby(
                        [pd.Grouper(freq=freq), 'Attribute_Name',
                         'Sensor_id']).min()
                    harm_df.reset_index(inplace=True)
                elif method == 'max':
                    harm_df = harm_df.groupby(
                        [pd.Grouper(freq=freq), 'Attribute_Name',
                         'Sensor_id']).max()
                    harm_df.reset_index(inplace=True)
                else:
                    harm_df = harm_df.groupby(
                        [pd.Grouper(freq=freq), 'Attribute_Name',
                         'Sensor_id']).mean()
                    harm_df.reset_index(inplace=True)

        if per_sensor:
            _harm_df = pd.DataFrame(columns=harm_df.columns)
            for i in harm_df.Sensor_id.unique():
                for j in harm_df.Attribute_Name.unique():
                    temp = harm_df[(harm_df.Sensor_id == i) & (
                            harm_df.Attribute_Name == j)]
                    temp['Timestamp'] = pd.to_datetime(temp['Timestamp'])
                    temp = temp.set_index('Timestamp')
                    temp = temp.resample(freq).ffill()
                    _harm_df = _harm_df.append(temp)

        _harm_df.Timestamp = _harm_df.index
        _harm_df.reset_index(inplace=True, drop=True)

        # get coordinates and sensor names in readable format
        if per_sensor:
            _sensor_names = []
            _l_id = []
            _lat = []
            _lon = []

            for sensor in harm_df.Sensor_id.unique():
                _temp_s = Sensor.get_by_id(sensor)
                _sensor_names.append(_temp_s.name)
                _l_id.append(_temp_s.l_id)

            for l in _l_id:
                _temp_l = Location.get_by_id(l)
                _lat.append(_temp_l.lat)
                _lon.append(_temp_l.lon)

            temp = pd.DataFrame(data=_harm_df.Sensor_id.unique(),
                                columns=['Sensor_id'])

            temp['Name'] = _sensor_names
            temp['Latitude'] = _lat
            temp['Longitude'] = _lon

            _harm_df = pd.merge(_harm_df.reset_index(drop=True), temp,
                                on='Sensor_id', how='left')

        data = json.loads(_harm_df.to_json(orient='records'))

        return data, 200
    except Exception as e:
        logger.log(logging.WARNING,
                   "Unexpected Exception raise during grouping"
                   "of attribute data: {}".format(e))
        return [], 422


def request_harmonised_data(data: {str: Any}, harmonising_method: str) -> [
    Any]:
    """
    Harmonize requested data with parsed harmonising method
    :param data: Attribute data
    :param harmonising_method: harmonize data acoording to method Long, Wide or
                               geojson.
    :return: Harmonized data
    """
    per_sensor = True
    temp = None
    df = pd.read_json(json.dumps(data), orient='records')

    harm_df = pd.DataFrame(columns=['Attribute_Name', 'Attribute_Table',
                                    'Sensor_id', 'Timestamp', 'Value'])
    ### Get the attributes
    for attribute in range(len(df)):
        attr = df.iloc[attribute].Attribute_Name
        attr_table = df.iloc[attribute].Attribute_Table
        attr_values = df.iloc[attribute].Attribute_Values

        harm_df_temp = pd.DataFrame(
            columns=['Attribute_Name', 'Attribute_Table',
                     'Sensor_id', 'Timestamp', 'Value'])

        try:
            harm_df_temp['Attribute_Name'] = [attr for i in
                                              range(len(attr_values))]
            harm_df_temp['Attribute_Table'] = [attr_table for i in
                                               range(len(attr_values))]

            harm_df_temp['Sensor_id'] = [i['Sensor_id'] for i in
                                         attr_values]
            harm_df_temp['Timestamp'] = [i['Timestamp'] for i in
                                         attr_values]
            harm_df_temp['Value'] = [i['Value'] for i in attr_values]

        except TypeError as te:
            logger.log(logging.DEBUG, "Attribute missing values: {}".format(
                attr_values))

        ### append to dataframe
        harm_df = harm_df.append(harm_df_temp, ignore_index=True)

        ### Commenting out the dtype conversion: related to issue #109
        # harm_df.Value = harm_df.Value.astype(float)

        ### get coordinates and sensor names in readable format
        _sensor_names = []
        _l_id = []
        _lat = []
        _lon = []

        for sensor in harm_df.Sensor_id.unique():
            _temp_s = (Sensor.get_by_id(sensor)).json()
            _sensor_names.append(_temp_s["Name"])
            _l_id.append(_temp_s["Location id"])

        for l in _l_id:
            _temp_l = (Location.get_by_id(l)).json()
            _lat.append(_temp_l["Latitude"])
            _lon.append(_temp_l["Longitude"])

        temp = pd.DataFrame(data=harm_df.Sensor_id.unique(),
                            columns=['Sensor_id'])

        temp['Name'] = _sensor_names
        temp['Latitude'] = _lat
        temp['Longitude'] = _lon

    try:
        if per_sensor:
            harm_df = pd.merge(harm_df.reset_index(drop=True), temp,
                               on='Sensor_id', how='left')

        ## set datetime index
        harm_df['Timestamp'] = pd.to_datetime(harm_df['Timestamp'])
        harm_df = harm_df.set_index('Timestamp')

        ### get attribute with the highest number of records (=proxy for greater frequency)
        _value_len = 0
        _benchmark_attr = harm_df['Attribute_Name'].iloc[0]

        for name, group in harm_df.groupby('Attribute_Name'):
            _temp = len(np.unique(group.index))

            if _temp > _value_len:
                _value_len = _temp
                _benchmark_attr = name

        ### make it the attribute which will be used for benchmarikg all other attributes
        _df = harm_df[harm_df.Attribute_Name == _benchmark_attr]
        _benchmark_attr_index = _df.index.unique()
        _df.reset_index(inplace=True)

        ### loop through all other attributes and sensors
        for i in np.delete(harm_df.Attribute_Name.unique(),
                           np.argwhere(
                               harm_df.Attribute_Name.unique() == _benchmark_attr)):
            for sensor in harm_df.Sensor_id.unique():
                _temp_df = harm_df[(harm_df.Attribute_Name == i) & (
                        harm_df.Sensor_id == sensor)]

                ### relate _temp_df to the benchmarking index (it gets the closest value by default)
                _temp_df = _temp_df.asof(_benchmark_attr_index)
                _temp_df.reset_index(inplace=True)
                _df = _df.append(_temp_df)

        ### clean the dataset of nan's (originating by the records that dont match the benchmark daterange)
        _df.dropna(inplace=True)

        ### check for missing attributes resulting from non overlapping temporal windows
        miss_attr = set(
            _df.Attribute_Name.unique().tolist()).symmetric_difference(
            harm_df.Attribute_Name.unique().tolist())
        if bool(miss_attr):
            ### if found, append it to the dataframe as is
            for i in miss_attr:
                _df = _df.append(
                    harm_df[harm_df.Attribute_Name == i].reset_index())
        else:
            pass

        ### pass the long vs wide data format
        if harmonising_method == 'wide':
            _df.reset_index(inplace=True)
            _df['Value'] = _df['Value'].astype(float)
            _df['timestamp'] = _df['Timestamp'].astype(
                int) / 10 ** 6  ### milliseconds
            _df = _df.pivot_table(index='Timestamp', columns='Attribute_Name',
                                  values=['Value', 'timestamp', 'Latitude',
                                          'Longitude'])

            data = json.loads(
                _df.to_json(orient='records').replace('["', '').replace('"]',
                                                                        '').replace(
                    '","', ','))
        elif harmonising_method == 'long':
            data = json.loads(_df.to_json(orient='records'))

        else:
            ### using geolachemy's to_shape function to grab the geometry of sensors (instead of lat lon).
            _df['wkt_geom'] = _df['Sensor_id'].apply(lambda x: str(to_shape(
                Location.get_by_id_in([Sensor.get_by_id(x).l_id])[0].geo)))
            data = data_geojson(_df)
    except Exception as e:
        logger.log(logging.WARNING,
                   "Unable to harmonize requested data {}".format(
                       data
                   ))
        return [], 200

    return data, 200
