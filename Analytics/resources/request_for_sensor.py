from flask_restful import Resource, reqparse, inputs

from db import db
from models.attributes import Attributes
from models.sensor_attribute import SensorAttribute
from models.sensor import Sensor


class RequestForSensor(Resource):
	"""
	API for retrieving sensor data from database
		One of the following parameters can be passed with url using GET requests
		:param sensor: accepts an id of the sensor and return its details, also accept a 
				value 'all' which would return all the sensor in the system
		:param sensorname: accepts the name of the sensor, works same as attribute can 
					return information about multiple sensor names when passed as
					comma separated string
		:param sensorattribute: accepts the id(s) of the sensor and returns the attributes 
						associated with the sensor
		:type sensor: string 
		:type sensorname: string
		:type sensorattribute: string
		:return: The requested sensor data from the database
		:rtype: JSON

		Few example queries:
			{URL}?sensor='<id-of-sensor>' // Retriving a single sensor
			{URL}?sensor=all 			  // Retriving all the sensors
			{URL}?sensorname='<name-of-sensor>' // Retriving by name
			{URL}?sensor='<name1>,<name2>' // To retrieve multiple records
	"""
	parser = reqparse.RequestParser()

	parser.add_argument('sensor', type=str, store_missing=False)
	parser.add_argument('sensorname', type=str, store_missing=False)
	parser.add_argument('sensorattribute', type=str, store_missing=False)

	def get(self):
		args = self.parser.parse_args()
		sensor, sensor_name, sensor_attribute = None, None, None


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

		

		return {
			"error": "error occured while processing request"
		}, 400
