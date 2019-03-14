import importlib
import logging
from typing import Callable

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)

import yaml
from flask_script import Command, Option


class AddDatasource(Command):
    """
    Helper Class

    This class can be used to add any importer to the database and retrieve information about them
    The importers can be added:
        python manage.py add -ad <Name-Of-The-Importer>

    The name of the importer can be found:
        python manage.py add -gd True
    """

    def __init__(self, add_datasource: Callable = None, get_datasources: bool = False):
        """
        Get or Add a DataSource
        :param add_datasource: Importer Callable
        :param get_datasources: If True A list of importers are returned
        """
        self.add_datasource = add_datasource
        self.get_datasources = get_datasources

    def get_options(self) -> [Option]:
        """
        Get command line arguments
        :return: A list of Options
        """
        return [
            Option('--get_datasources', '-gd', dest='get_datasources', default=self.get_datasources),
            Option('--add_datasource', '-ad', dest='add_datasource', default=self.add_datasource),
        ]

    def get_config(self) -> {str: {str}}:
        """
        Get Importer Config
        :return: Importer Configurations
        """
        config = None
        try:
            with open("importers/config.yml") as ymlfile:
                config = yaml.load(ymlfile)
        except FileNotFoundError as e:
            logger.critical("No Importer Config File Found", file="importers/config.yml")
            raise FileNotFoundError

        return config

    def run(self, get_datasources: bool, add_datasource: str) -> object:
        """
        Execute Commands
        :param get_datasources: If True a list of DataSource Importers are returned
        :param add_datasource: Callable Str Name
        :return: A DataSource Object
        """
        config = self.get_config()
        config = config[config['environment']]
        _importers = {}
        for c in config:
            _importers[config[c]['API_NAME']] = config[c]['API_CLASS']
            if get_datasources and config[c]['API_CLASS'] is not None:
                # Cannot remove this as the user will not receive any DataSources back as it is a command line util
                print(config[c]['API_NAME'])

        if get_datasources:
            return

        _p, _c = _importers[add_datasource].rsplit('.', 1)
        _class = getattr(importlib.import_module(_p), _c)
        _object = _class()
        _object._create_datasource()
