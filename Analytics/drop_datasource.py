"""

Script to delete datasource
It is a handy script to delete datasource, while creating and new importers
The script only takes one argument the name of the API that needs to be deleted

"""

import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


from app import create_app
from db import db
from models.api import API
from models.sensor import Sensor
from models.sensor_attribute import SensorAttribute
from models.attributes import Attributes
from models.attribute_data import ModelClass
from flask_script import Command, Option

class DropDatasource(Command):

	def __init__(self, id=None, datasources=False):
		self.datasources = datasources
		self.id = id

	def get_options(self):
		return [
		Option('--api_id', '-id', dest='id', default=self.id),
		Option('--datasources', '-d', dest='datasources', default=self.datasources)
		]

	def run(self, id, datasources):
		apis = API.get_all()
		_dict = {}
		for a in apis:
			_dict[a.name] = a
			if datasources:
				print(a.name)

		if id is None:
			return

		self.drop_datasource(_dict[id].id)
		db.session.delete(_dict[id])
		db.session.commit()
		print('Dropped Datasource for API: ', id)

	def drop_datasource(self, id):
		sensors = Sensor.query.filter_by(a_id = id).all()
		sensor_list = []
		for s in sensors:
			sensor_list.append(s.id)
			db.session.delete(s)
		
		sensor_attributes = db.session.query(SensorAttribute)\
							.filter(SensorAttribute.s_id.in_((sensor_list)))\
							.all()

		attribute_ids = set()
		for sa in sensor_attributes:
			attribute_ids.add(sa.a_id)
			db.session.delete(sa)


		attributes = db.session.query(Attributes)\
						.filter(Attributes.id.in_((attribute_ids))).all()


		for attribute in attributes:
			model = ModelClass(attribute.table_name.lower())
			model.__table__.drop(db.engine)
			db.session.delete(attribute)
	
	

