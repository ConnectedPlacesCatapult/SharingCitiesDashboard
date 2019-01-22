import pandas as pd
import json
import numpy as np
from models.sensor import Sensor
from models.location import Location

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
"""

def request_grouped_data(data, per_sensor, freq):
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
		harm_df.Value = harm_df.Value.astype(float)

		if not per_sensor:
			### Using the median to preserve the data type during groupby aggregation
			harm_df = harm_df.groupby([pd.Grouper(freq=freq), 'Attribute_Name']).median()
			harm_df.reset_index(inplace=True)

		else:
			harm_df = harm_df.groupby([pd.Grouper(freq=freq), 'Attribute_Name', 'Sensor_id']).median()
			harm_df.reset_index(inplace=True)

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
			
			temp = pd.DataFrame(data = harm_df.Sensor_id.unique(),
				columns=['Sensor_id'])

			temp['Name'] = _sensor_names
			temp['Latitude'] = _lat
			temp['Longitude'] = _lon

	if per_sensor:
		harm_df = pd.merge(harm_df.reset_index(drop=True),temp, 
		                           on ='Sensor_id', how='left')

	data = json.loads(harm_df.to_json(orient='records'))


	return data

def request_harmonised_data(data, harmonising_method):
	per_sensor=True

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
		harm_df.Value = harm_df.Value.astype(float)


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
		
		temp = pd.DataFrame(data = harm_df.Sensor_id.unique(),
			columns=['Sensor_id'])

		temp['Name'] = _sensor_names
		temp['Latitude'] = _lat
		temp['Longitude'] = _lon

	if per_sensor:
		harm_df = pd.merge(harm_df.reset_index(drop=True),temp, 
		                           on ='Sensor_id', how='left')


	## set datetime index
	harm_df['Timestamp'] = pd.to_datetime(harm_df['Timestamp'])
	harm_df = harm_df.set_index('Timestamp')

	### get attribute with the highest number of records (=proxy for greater frequency)
	_value_len = 0
	for name, group in harm_df.groupby('Attribute_Name'):
		_benchmark_attr = name
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

	data = json.loads(_df.to_json(orient='records'))

	return data
