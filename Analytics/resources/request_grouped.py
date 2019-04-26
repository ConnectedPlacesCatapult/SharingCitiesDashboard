import pandas as pd
import json
import numpy as np
from models.sensor import Sensor
from models.location import Location
import geojson
from geoalchemy2.shape import to_shape 
import shapely.wkt

"""
This function groups sensor data having different temporal frequencies by grouping at 
hourly intervals. The grouping is based on the median of all sensor values that fall within
the hourly interval for three reasons: a) The purpose of this function is to provide the 
frontend with a convenient form of visualising the data. as such, it is not used in any subsequent 
analytics b) Median is more robust to outliers and c) Median preserves the original datatype format.

@params:
	data: a json object from request_for_data.get_attribute_data. 
	per_sensor: A boolean flag of whether the reformormatted request returns data per individual sensor
	or per attribute
	freq: temporal frequency of aggregation 'W', '1D', '1H', '1Min'
	harmonising_method: harmonises attributes relative to the one with the higher frequency and delivers the data 
	either on a long/wide format or a geojson 
"""

def data_geojson(df):
	### Creates a geojson by loading the wkt geometry
    features = []
    insert_features = lambda X: features.append(
            geojson.Feature(geometry=shapely.wkt.loads(X["wkt_geom"]),
                            properties=dict(Attribute_Name=X["Attribute_Name"],
                            				Value=X["Value"],
											Name=X["Name"])))
    df.apply(insert_features, axis=1)
    return geojson.FeatureCollection(features)
        


def request_grouped_data(data, per_sensor, freq, method):
	df = pd.read_json(json.dumps(data), orient = 'records')
	harm_df = pd.DataFrame(columns=['Attribute_Name','Attribute_Table',
										'Sensor_id', 'Timestamp', 'Value'])
	## Get the attributes
	for attribute in range(len(df)):
		attr = df.iloc[attribute].Attribute_Name
		attr_table = df.iloc[attribute].Attribute_Table
		attr_values = df.iloc[attribute].Attribute_Values


		harm_df_temp = pd.DataFrame(columns=['Attribute_Name','Attribute_Table',
										'Sensor_id', 'Timestamp', 'Value'])

		harm_df_temp['Attribute_Name'] = [attr for i in range(len(attr_values))]
		harm_df_temp['Attribute_Table'] = [attr_table for i in range(len(attr_values))]

		harm_df_temp['Sensor_id'] = [i['Sensor_id'] for i in attr_values]
		harm_df_temp['Timestamp'] = [i['Timestamp'] for i in attr_values]
		harm_df_temp['Value'] = [i['Value'] for i in attr_values] 

		### append to dataframe
		harm_df = harm_df.append(harm_df_temp,ignore_index=True)

		### set datetime index
		harm_df['Timestamp'] = pd.to_datetime(harm_df['Timestamp'])
		harm_df = harm_df.set_index('Timestamp')

		### TODO add informative message in the case the user provides an atribute with non-numeric attributes. 
		### Related to issue #109 
		harm_df.Value = harm_df.Value.astype(float)

		if not per_sensor:
			if method == 'median':
				harm_df = harm_df.groupby([pd.Grouper(freq=freq), 'Attribute_Name']).median()
			elif method == 'min':
				harm_df = harm_df.groupby([pd.Grouper(freq=freq), 'Attribute_Name']).min()
			elif method =='max':
				harm_df = harm_df.groupby([pd.Grouper(freq=freq), 'Attribute_Name']).max()
			else: 
				harm_df = harm_df.groupby([pd.Grouper(freq=freq), 'Attribute_Name']).mean()
			harm_df.reset_index(inplace=True)
			_harm_df = pd.DataFrame(columns = harm_df.columns)
			for i in harm_df.Attribute_Name.unique():
				temp = harm_df[harm_df.Attribute_Name == i]
				temp['Timestamp'] = pd.to_datetime(temp['Timestamp'])
				temp = temp.set_index('Timestamp')
				temp = temp.resample(freq).ffill()
				_harm_df = _harm_df.append(temp)
		else:
			if method == 'median':
				harm_df = harm_df.groupby([pd.Grouper(freq=freq), 'Attribute_Name', 'Sensor_id']).median()
				harm_df.reset_index(inplace=True)
			elif method == 'min':
				harm_df = harm_df.groupby([pd.Grouper(freq=freq), 'Attribute_Name', 'Sensor_id']).min()
				harm_df.reset_index(inplace=True)
			elif method =='max':
				harm_df = harm_df.groupby([pd.Grouper(freq=freq), 'Attribute_Name', 'Sensor_id']).max()
				harm_df.reset_index(inplace=True)
			else: 
				harm_df = harm_df.groupby([pd.Grouper(freq=freq), 'Attribute_Name', 'Sensor_id']).mean()
				harm_df.reset_index(inplace=True)
			

	if per_sensor:
		_harm_df = pd.DataFrame(columns = harm_df.columns)
		for i in harm_df.Sensor_id.unique():
			for j in harm_df.Attribute_Name.unique():
				temp = harm_df[(harm_df.Sensor_id == i) & (harm_df.Attribute_Name == j)]
				temp['Timestamp'] = pd.to_datetime(temp['Timestamp'])
				temp = temp.set_index('Timestamp')
				temp = temp.resample(freq).ffill()
				_harm_df = _harm_df.append(temp)
				

		

	_harm_df.Timestamp = _harm_df.index
	_harm_df.reset_index(inplace=True, drop=True)

	### get coordinates and sensor names in readable format  
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

		temp = pd.DataFrame(data = _harm_df.Sensor_id.unique(),
			columns=['Sensor_id'])

		temp['Name'] = _sensor_names
		temp['Latitude'] = _lat
		temp['Longitude'] = _lon

		_harm_df = pd.merge(_harm_df.reset_index(drop=True),temp, 
								on ='Sensor_id', how='left')

	data = json.loads(_harm_df.to_json(orient='records'))


	return data

def request_harmonised_data(data, harmonising_method):
	per_sensor=True

	df = pd.read_json(json.dumps(data), orient = 'records')
	harm_df = pd.DataFrame(columns=['Attribute_Name','Attribute_Table',
                                        'Sensor_id', 'Timestamp', 'Value'])
	temp = pd.DataFrame()
    ### Get the attributes
	for attribute in range(len(df)):

		attr = df.iloc[attribute].Attribute_Name
		attr_table = df.iloc[attribute].Attribute_Table
		attr_values = df.iloc[attribute].Attribute_Values    


		harm_df_temp = pd.DataFrame(columns=['Attribute_Name','Attribute_Table',
		                                'Sensor_id', 'Timestamp', 'Value'])

		harm_df_temp['Attribute_Name'] = [attr for i in range(len(attr_values))]
		harm_df_temp['Attribute_Table'] = [attr_table for i in range(len(attr_values))]

		harm_df_temp['Sensor_id'] = [i['Sensor_id'] for i in attr_values]
		harm_df_temp['Timestamp'] = [i['Timestamp'] for i in attr_values]
		harm_df_temp['Value'] = [i['Value'] for i in attr_values] 

		### append to dataframe
		harm_df = harm_df.append(harm_df_temp,ignore_index=True)

		### Commenting out the dtype conversion: related to issue #109 
		# harm_df.Value = harm_df.Value.astype(float)

		### get coordinates and sensor names in readable format  
		_sensor_names = []
		_l_id = []
		_lat = []
		_lon = []

		for sensor in harm_df.Sensor_id.unique():
			sens = Sensor.get_by_id(sensor)
			if not sens:
				_temp_s = {
					'id': sensor,
					'Api id': "Not Found",
					'Location id': 10000,
					'Name': "Not Found",
					'Timestamp': "None"
				}
			else:
				_temp_s = sens.json()
			_sensor_names.append(_temp_s["Name"])
			_l_id.append(_temp_s["Location id"])

		for l in _l_id:
			location = Location.get_by_id(l)
			if not location:
				_temp_l["Latitude"] = 0.0
				_temp_l["Longitude"] = 0.0

			else:
				_temp_l = location.json()
			_lat.append(_temp_l["Latitude"])
			_lon.append(_temp_l["Longitude"])
		
		temp = pd.DataFrame(data = harm_df.Sensor_id.unique(),
			columns=['Sensor'
					 '_id'])

		temp['Name'] = _sensor_names
		temp['Latitude'] = _lat
		temp['Longitude'] = _lon
	print(temp.to_string())
	if per_sensor:
		harm_df = pd.merge(harm_df.reset_index(drop=True),temp, 
		                           on ='Sensor_id', how='left')


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
			np.argwhere(harm_df.Attribute_Name.unique()==_benchmark_attr)):
		for sensor in harm_df.Sensor_id.unique():
			_temp_df = harm_df[(harm_df.Attribute_Name == i) & (harm_df.Sensor_id == sensor)] 

			### relate _temp_df to the benchmarking index (it gets the closest value by default) 
			_temp_df = _temp_df.asof(_benchmark_attr_index)
			_temp_df.reset_index(inplace=True)
			_df = _df.append(_temp_df)



	### clean the dataset of nan's (originating by the records that dont match the benchmark daterange)
	_df.dropna(inplace=True)

	### check for missing attributes resulting from non overlapping temporal windows
	miss_attr = set(_df.Attribute_Name.unique().tolist()).symmetric_difference( harm_df.Attribute_Name.unique().tolist())
	if bool(miss_attr):
		### if found, append it to the dataframe as is
		for i in miss_attr:
			_df = _df.append(harm_df[harm_df.Attribute_Name == i].reset_index())
	else:
		pass

	### pass the long vs wide data format
	if harmonising_method == 'wide':
		_df.reset_index(inplace=True)
		_df['Value'] = _df['Value'].astype(float)
		_df['timestamp'] = _df['Timestamp'].astype(int) / 10**6 ### milliseconds
		_df = _df.pivot_table(index='Timestamp', columns='Attribute_Name', values=['Value','timestamp','Latitude', 'Longitude'])

		data = json.loads(_df.to_json(orient='records').replace('["','').replace('"]','').replace('","',','))
	elif harmonising_method == 'long':
		data = json.loads(_df.to_json(orient='records'))

	else:
		### using geolachemy's to_shape function to grab the geometry of sensors (instead of lat lon).  
		_df['wkt_geom'] = _df['Sensor_id'].apply(lambda x: str(to_shape(Location.get_by_id_in([Sensor.get_by_id(x).l_id])[0].geo)))
		data = data_geojson(_df)

	return data
