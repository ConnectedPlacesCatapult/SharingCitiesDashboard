"""
API for retrieving data from backend
Note: If no parameters are passed then by default all the themes are returned
@params
	Parameters can be passed with url using get requests
	theme: accepts an integer id and return subthemes for that theme
	subtheme: accepts an integer id and returns all the attributes 
				associated with the subtheme
	attribute: accepts name of attributes, more then one attribute names 
				can be passed as comma separated values
	attributedata: works in similar way to attribute but instead of returing
					attribute details it return data associated with the 
					attribute
	sensor: accepts an id of the sensor and return its details, also accept a 
			value 'all' which would return all the sensor in the system
	sensorname: accepts the name of the sensor, works same as attribute can 
				return information about multiple sensor names when passed as
				comma separated string
	sensorattribute: accepts the id(s) of the sensor and returns the attributes 
					associated with the sensor
	limit: accepts an integer and would return only those number of records
			default is 30
	offset: accepts an integer and default is 30, used when one would want to
			skip few records, useful in pagination
	fromdate: accepts a date in YYYY-MM-DD format, start date of the records
	todate: accepts a date in YYYY-MM-DD formart, end date of the records
	operation: when mathematical calculation needs to be perfomed
	grouped: boolean specifying whether the sensor records are to be grouped at hourly intervals
		per_sensor: boolean specifying whether the sensor records are to be grouped at hourly intervals and 
					per individual sensor. Defaults to False

	Note: fromdate and todate both needs to be present in order for date filtering to work

	Few example queries:
		{URL}?sensor='<id-of-sensor>' // Retriving a single sensor
		{URL}?sensor=all 			  // Retriving all the sensors
		{URL}?sensorname='<name-of-sensor>' // Retriving by name
		{URL}?sensor='<name1>,<name2>' // To retrieve multiple records
		{URL}?attributedata='<name-of-attribute>&limit=60&offset=60' // Retrieve records but increase limit and skip 60
		{URL}?attributedata='<name1><name2>&limit=60&offset=60&fromdate=2018-11-22&todate=2018-11-24'
		{URL}?attributedata='<name1><name2>&limit=1000&grouped=True&per_sensor=True&freq='1H' // Retrieves records and groups the data at hourly intervals
		{URL}?attributedata='<name1><name2>&limit=1000&grouped=True&per_sensor=False&freq='1H' // Retrieves records and groups the data from all sensors of same attribute at hourly intervals
		{URL}?attributedata='<name1><name2>&limit=1000&grouped=True&harmonising_method=long // Harmonisies all attributes in the query to match the attribute with the most records. It also reformats the data to be structured as long (row stacked) or wide (column stacked)

"""


from flask_restful import Resource, reqparse, inputs
from db import db
from models.theme import Theme
from models.attributes import Attributes
from models.theme import SubTheme
from models.attribute_data import ModelClass
from models.sensor_attribute import SensorAttribute
from models.sensor import Sensor
from models.location import Location
from models.unit import Unit
from resources.predict import predict
from resources.helper_functions import is_number
from sqlalchemy import desc
from datetime import datetime
import statistics
from resources.request_grouped import request_grouped_data, request_harmonised_data


LIMIT = 30
OFFSET = 30

class RequestForData(Resource):
	parser = reqparse.RequestParser()
	parser.add_argument('theme', type=str, store_missing=False)
	parser.add_argument('subtheme', type=str, store_missing=False)
	parser.add_argument('attribute', type=str, store_missing=False)
	parser.add_argument('attributedata', type=str, store_missing=False)
	parser.add_argument('sensor', type=str, store_missing=False)
	parser.add_argument('sensorname', type=str, store_missing=False)
	parser.add_argument('sensorattribute', type=str, store_missing=False)
	parser.add_argument('limit', type=int, store_missing=False)
	parser.add_argument('offset', type=int, store_missing=False)
	parser.add_argument('fromdate', type=str, store_missing=False)
	parser.add_argument('todate', type=str, store_missing=False)
	parser.add_argument('operation', 
						type=str,
						choices=('mean', 'median', 'sum'),
						store_missing=False)
	parser.add_argument('grouped', type=inputs.boolean, store_missing=False)
	parser.add_argument('freq', type=str,
						choices=('1W', '1D', '1H', '1Min', '1M'),
						store_missing=False)
	parser.add_argument('method', type=str,
						choices=('mean', 'median', 'min', 'max'),
						store_missing=False)
	parser.add_argument('harmonising_method', 
						type=str,
						choices=('long', 'wide', 'geo'),
						store_missing=False)
	parser.add_argument('per_sensor', type=inputs.boolean, store_missing=False)
	parser.add_argument('sensorid', type=str)
	parser.add_argument('n_predictions', type=int, store_missing = False)
	parser.add_argument('predictions', type=inputs.boolean, store_missing = False)

	def get(self):
		args = self.parser.parse_args()
		theme, subtheme, attribute_data, sensor, sensor_name, sensor_attribute, attributes, sensorid, n_predictions, predictions, grouped, harmonising_method, per_sensor, freq, method = None, None, None, None, None, None, [], None, 100, None, None, None, None, '1H', 'mean'

		if 'theme' in args:
			theme = args['theme']

		if 'subtheme' in args:
			subtheme = args['subtheme']

		if 'attributedata' in args:
			attribute_data = args['attributedata']

		if 'attribute' in args and args['attribute'] is not None:
			_attributes = args['attribute']
			if _attributes != '':
				attributes = _attributes.split(',')

		if 'sensor' in args and args['sensor'] is not None:
			sensor = args['sensor']
			if sensor != '':
				if sensor == 'all':
					sensors = Sensor.get_all()
					return [a.json() for a in sensors], 200
				else:
					return (Sensor.get_by_id(sensor)).json(), 200

		if 'sensorname' in args and args['sensorname'] is not None:
			sensor_name = args['sensorname']
			if sensor_name != '':
				_sensors = sensor_name.split(',')
				_by_name = Sensor.get_by_name_in(_sensors)
				return [a.json() for a in _by_name], 200

		if 'sensorattribute' in args and args['sensorattribute'] is not None:
			sensor_attribute = args['sensorattribute']
			if sensor_attribute != '':
				_sen_attrs_ids = sensor_attribute.split(',')
				_sen_attrs = SensorAttribute.get_by_id_in(_sen_attrs_ids)
				attrs_ids = [_id.a_id for _id in _sen_attrs]
				_attributes = Attributes.get_by_id_in(attrs_ids)
				return [a.json() for a in _attributes], 200

		if 'grouped' in args:
			grouped = args['grouped']

		if 'harmonising_method' in args:
			harmonising_method = args['harmonising_method']

		if 'per_sensor' in args:
			per_sensor = args['per_sensor']

		if 'freq' in args:
			freq = args['freq']

		if 'method' in args:
			method = args['method']

		if 'predictions' in args:
			predictions = args['predictions']
			if predictions >=100:
				predictions = 100

		if 'n_predictions' in args:
			n_predictions = args['n_predictions']

		if 'sensorid' in args:
			sensorid = args['sensorid']

		if theme is None and subtheme is None \
			and len(attributes) == 0 and attribute_data is None \
			and sensor is None and sensor_name is None and sensor_attribute is None:
			themes = Theme.get_all()
			return [a.json() for a in themes], 200

		if attribute_data is not None:
			global LIMIT, OFFSET
			data = None
			operation = None
			if 'limit' in args and args['limit'] is not None:
				LIMIT = args['limit']

			if 'offset' in args and args['offset'] is not None:
				OFFSET = args['offset']

			if 'operation' in args and args['operation'] is not None:
				operation = args['operation']

			if ('fromdate' in args and args['fromdate'] is not None 
				and 'todate' in args and args['todate'] is not None):
				if grouped:
					if harmonising_method:
						data = self.get_attribute_data(attribute_data, LIMIT, OFFSET, 
												args['fromdate'], args['todate'], operation)
						data = request_harmonised_data(data, harmonising_method=harmonising_method)
					else:
						data = self.get_attribute_data(attribute_data, LIMIT, OFFSET, 
												args['fromdate'], args['todate'], operation)
						data = request_grouped_data(data, per_sensor=per_sensor, freq=freq, method=method)
				else:
					data = self.get_attribute_data(attribute_data, LIMIT, OFFSET, 
												args['fromdate'], args['todate'], operation)
				if predictions:
					data.append(self.get_predictions(attribute_table = data[0]["Attribute_Table"],
														sensor_id = sensorid,
														n_pred = n_predictions))
			else:
				if grouped:
					if harmonising_method:
						data = self.get_attribute_data(attribute_data, LIMIT, OFFSET, operation=operation)
						data = request_harmonised_data(data, harmonising_method=harmonising_method)
					else:
						data = self.get_attribute_data(attribute_data, LIMIT, OFFSET, operation=operation)
						data = request_grouped_data(data, per_sensor=per_sensor, freq=freq, method=method)
				else:
					data = self.get_attribute_data(attribute_data, LIMIT, OFFSET, operation=operation)

				if predictions:
					#### Ceck for data
					if data[0]["Total_Records"] != 0:
					#### Check for non numeric data
						if is_number(data[0]["Attribute_Values"][0]["Value"]):
							data.append(self.get_predictions(attribute_table = data[0]["Attribute_Table"],
																sensor_id = sensorid,
																n_pred = n_predictions))
						else:
							print("Cannot predict non-numeric data")
							pass
					else:
						pass
			return data, 200

		if attributes:
			_attrs = []
			attr = Attributes.get_by_name_in(attributes)
			for a in attr:
				_attrs.append(a.json())
			return _attrs, 200

		if subtheme is not None and subtheme != '':
			attributes = Attributes.get_by_sub_theme_id(subtheme)
			return [a.json() for a in attributes], 200

		if theme is not None and theme != '':
			subthemes = SubTheme.get_by_theme_id(theme)
			return [a.json() for a in subthemes], 200

		return {
			"error": "error occured while processing request"
		}, 400


	'''
	@Params
		attribute_name: is string passed as parameter with the URL
		limit: Default is 30, number of records to be returned
		offset: From where the records needs to start
		Filters:
			fromdate: Format for passing date is YYYY-MM-DD
			todate: Format for the passing the is YYYY-MM-DD
		operation: Mathematical operations that can be performed on data
					accepted values are: 'mean', 'median', 'sum'
					(More to be added)
	'''
	def get_attribute_data(self, attribute_name, limit, offset,
							fromdate=None, todate=None, operation=None):
		# clearing previous metadata
		db.metadata.clear()
		attrs = attribute_name.split(',')

		attributes = Attributes.get_by_name_in(attrs)
		data = []
		for attribute in attributes:
			model = ModelClass(attribute.table_name.lower())
			count = db.session.query(model).count()
			values = []
			if fromdate is not None and todate is not None:
				if operation is None:

					values = db.session.query(model) \
							.filter(model.api_timestamp >= fromdate) \
							.filter(model.api_timestamp <= todate) \
							.limit(limit).all() 
							

					#.offset(abs(count - offset)) 
				else:
					values = db.session.query(model) \
							.filter(model.api_timestamp >= fromdate) \
							.filter(model.api_timestamp <= todate) \
							.all()
			else:
				if operation is None:

					### refactored the query to fetch the latest values by default
					values = db.session.query(model).order_by(desc(model.api_timestamp)).limit(limit).all() # \
					# values = db.session.query(model).limit(limit) \
					# 				.offset(abs(count - offset)).all()

				else:
					values = db.session.query(model).all()



			_common = {
					'Attribute_Table': attribute.table_name,
					'Attribute_Name': attribute.name,
					'Attribute_Description': attribute.description,
					'Attribute_Unit_Description': Unit.get_by_id(attribute.unit_id).description,
					'Attribute_Unit_Value': Unit.get_by_id(attribute.unit_id)._type,
					'Total_Records': count
					}
			temp = []
			if operation is None:
				for i in range(len(values)-1, -1, -1):
					s = Sensor.get_by_id(values[i].s_id)
					temp.append({
						'Attribute_Name': attribute.name,
						'Sensor_id': values[i].s_id,
						'Timestamp': str(values[i].api_timestamp),
						'Value': values[i].value,
						'Name': s.name,
						'Latitude': Location.get_by_id(s.l_id).lat,
						'Longitude': Location.get_by_id(s.l_id).lon
					})
				_common['Attribute_Values'] = temp
			else:
				_values = [v.value for v in values]
				_int_values = list(map(float, _values))
				_operation_result = 0
				if operation == 'sum':
					_operation_result = sum(_int_values)
				elif operation == 'mean':
					_operation_result = sum(_int_values) / len(_int_values)
				elif operation == 'median':
					_operation_result = statistics.median(_int_values)
				_common['Result_' + operation] = _operation_result
			data.append(_common)

		return data

	'''
		@Params
			attribute_table: is string passed as parameter with the URL
			sensor_id: is string passed as parameter with the URL
			
	'''
	def get_predictions(self, attribute_table, sensor_id, n_pred):
		db.metadata.clear()

		_data = []
		_timestamps = []
		_limit = 10000

		model = ModelClass(attribute_table.lower())


		if db.session.query(model).count() < 100:
			pred_data =  {
							"Predictions": "not enough data to make reliable predictions"
						}
			return pred_data
		else:
		# check for sensor_id
			if sensor_id:
				values = db.session.query(model) \
							.filter(model.s_id == sensor_id) \
							.limit(_limit) \
							.all()
				if len(values) < 100:
					pred_data =  {
								"Predictions": "not enough data to make reliable predictions"
								}
					return pred_data
			else:	
				values = db.session.query(model) \
							.limit(_limit) \
							.all()
				if len(values) < 100:
					pred_data =  {
								"Predictions": "not enough data to make reliable predictions"
								}
					return pred_data

			for val in values:
				_data.append(float(val.value))
				_timestamps.append(val.api_timestamp)


			_pred, _mape, _method = predict(_data, _timestamps, n_pred)

			if sensor_id:
				_sensorid = sensor_id
			else:
				_sensorid = "All sensors"

			pred_data =  {
						"Sensor_id": _sensorid,
						"Forcasting_engine": _method,
						"Mean_Absolute_Percentage_Error": _mape,
						"Predictions": _pred
						}

		return pred_data
		