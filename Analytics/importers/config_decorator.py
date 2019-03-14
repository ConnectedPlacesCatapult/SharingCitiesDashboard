import os
import traceback
from typing import Callable

import yaml

from .state_decorator import ImporterStatus, Status


class GetConfig(object):
    """
    GetConfig decorator
    """

    def __init__(self, cls_name: str, config_filename: str = 'config.yml') -> None:
        """
        Initiate Decorators Scope
        :param cls_name: Calling Class __name__
        :param config_filename: Config filename
        """
        self.config_file = config_filename
        self.cls_name = cls_name
        self.config = None

    def __call__(self, cls: object) -> Callable:
        class Wrapped(cls):
            """
            Create wrapper to decorate target Class with get_config method
            :param cls: Class to be wrapped
            """
            setattr(self, 'API_NAME', None)
            setattr(self, 'BASE_URL', None)
            setattr(self, 'REFRESH_TIME', None)
            setattr(self, 'API_KEY', None)
            setattr(self, 'TOKEN_EXPIRY', None)
            setattr(self, 'API_CLASS', None)

            config_file = self.config_file

            def get_config(self, *args: str):
                """
                Get configutrations from config file
                :param args: Lookup keys for yaml config file
                :return: Configurations if successful otherwise None
                """
                importer_status = ImporterStatus.get_importer_status()

                self.config = None

                try:
                    if not os.path.isfile(self.config_file):
                        self.config_file = 'importers/' + self.config_file

                    with open(self.config_file, 'r') as ymlfile:
                        self.config = yaml.load(ymlfile)
                except FileNotFoundError as e:
                    importer_status.status = Status.failure(
                        self.__class__.__name__, e.__str__(),
                        traceback.format_exc())
                    return

                if len(args) == 2:
                    try:
                        self.config = self.config[self.config[args[0]]][args[1]]
                        self.API_NAME = self.config['API_NAME']
                        self.BASE_URL = self.config['BASE_URL']
                        self.REFRESH_TIME = self.config['REFRESH_TIME']
                        self.API_KEY = self.config['API_KEY']
                        self.TOKEN_EXPIRY = self.config['TOKEN_EXPIRY']
                        self.API_CLASS = self.config['API_CLASS']
                        return self.config
                    except Exception as e:
                        importer_status.status = Status.failure(
                            cls.__class__.__name__, e.__str__(),
                            traceback.format_exc())
                        return None
                else:
                    self.API_NAME = None
                    self.BASE_URL = None
                    self.REFRESH_TIME = None
                    self.API_KEY = None
                    self.TOKEN_EXPIRY = None
                    self.API_CLASS = None
                importer_status.status = Status.success(__class__.__name__)
                return self.config

        return Wrapped
