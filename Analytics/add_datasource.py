'''
Helper Class

This class can be used to add any importer to the database and retrieve information about them
The importers can be added:
	python manage.py add -ad <Name-Of-The-Importer>

The name of the importer can be found:
	python manage.py add -gd True
'''

import importlib

import yaml
from flask_script import Command, Option


class AddDatasource(Command):

    def __init__(self, add_datasource=None, get_datasources=False):
        self.add_datasource = add_datasource
        self.get_datasources = get_datasources

    def get_options(self):
        return [
            Option('--get_datasources', '-gd', dest='get_datasources', default=self.get_datasources),
            Option('--add_datasource', '-ad', dest='add_datasource', default=self.add_datasource),
        ]

    def get_config(self):
        config = None
        try:
            with open("importers/config.yml", 'r') as ymlfile:
                config = yaml.load(ymlfile)
        except FileNotFoundError as e:
            print("Ensure that you have provided a config.yml file")
            raise FileNotFoundError

        return config

    def run(self, get_datasources, add_datasource):
        config = self.get_config()
        config = config[config['environment']]
        _importers = {}
        for c in config:
            _importers[config[c]['API_NAME']] = config[c]['API_CLASS']
            if get_datasources and config[c]['API_CLASS'] is not None:
                print(config[c]['API_NAME'])

        if get_datasources:
            return

        _p, _c = _importers[add_datasource].rsplit('.', 1)
        _class = getattr(importlib.import_module(_p), _c)
        _object = _class()
        _object._create_datasource()
