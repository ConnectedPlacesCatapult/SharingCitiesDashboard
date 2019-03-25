import os
import traceback
from typing import Callable, Any

import yaml

from .state_decorator import ImporterStatus, Status


class GetConfig(object):
    """
    GetConfig decorator
    """

    def __init__(self, cls_name: str, environment: str, importer: str, config_filename: str = 'config.yml') -> None:
        """
        Initiate Decorators Scope
        :param cls_name: Calling Class __name__
        :param config_filename: Config filename
        """
        __class__.__name__ = cls_name
        self.config_file = config_filename
        self.cls_name = cls_name
        self.config = {}
        self.environment = environment
        self.importer = importer

    def __call__(self, cls: object) -> Callable:
        self.__class__.__name__ = cls.__name__

        class Wrapped(cls):
            """
            Create wrapper to decorate target Class with get_config method
            :param cls: Class to be wrapped
            """
            config_file = self.config_file
            env = self.environment
            importer = self.importer
            config = None

            def get_config(self):
                """
                Get configutrations from config file
                """
                importer_status = ImporterStatus.get_importer_status()

                # self.config = None
                if not os.path.isfile(self.config_file):
                    self.config_file = os.path.join('importers', self.config_file)

                try:
                    with open(self.config_file) as ymlfile:
                        self.config = yaml.full_load(ymlfile)

                    self.config = (self.config[self.config[self.env]][self.importer])
                    for key in self.config.keys():

                        if isinstance(self.config[key], dict):
                            setattr(self, key, Map(self.config[key]))
                        else:
                            setattr(self, key, self.config[key])

                except FileNotFoundError as e:
                    importer_status.status = Status.failure(__class__.__name__, e.__str__(), traceback.format_exc())
                    exit()

                importer_status.status = Status.success(__class__.__name__)

        return Wrapped


class Map(dict):
    """
    Unpack Dict into class attributes
    """

    def __init__(self, *args: Any, **kwargs: dict):
        """ Unpack args and kwargs into class attributes"""
        super(Map, self).__init__(*args, **kwargs)
        for arg in args:
            if isinstance(arg, dict):
                for k, v in arg.items():
                    self[k] = v

        if kwargs:
            for k, v in kwargs.items():
                self[k] = v

    def __getattr__(self, attr: str) -> Any:
        """
        Get Class Attribute by name
        :param attr:  Attributes name
        :return: Attribute with parsed name
        """
        return self.get(attr)

    def __setattr__(self, key: str, value: Any) -> None:
        """
        Set Class Atttribute
        :param key: Attributes name
        :param value: Value of new Attribute
        """
        self.__setitem__(key, value)

    def __setitem__(self, key: str, value: Any) -> None:
        """
        Set Value of Attribute in dict
        :param key: Attribute name
        :type key:
        :param value: Value to store in attribute
        """
        super(Map, self).__setitem__(key, value)
        self.__dict__.update({key: value})

    def __delattr__(self, item: Any) -> None:
        """
        Delete Attribute
        :param item: Attribute
        """
        self.__delitem__(item)

    def __delitem__(self, key: str) -> None:
        """
        Delete attribute by name
        :param key: Attribute name
        """
        super(Map, self).__delitem__(key)
        del self.__dict__[key]
