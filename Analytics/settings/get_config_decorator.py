import logging
import pathlib
from typing import Callable, Any, Union

import yaml
import os
import re

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class GetConfig(object):
    """
    GetConfig decorator
    """

    def __init__(self, cls_name: str, category: str,
                 sub_category: Union[str, None] = None,
                 config_path: Union[str,None] = None) -> None:
        if not config_path:
            self.working_dir = self.get_working_directory()
            config_path = os.path.join(self.working_dir, 'config.yml')

        self.config = self.get_config(config_path, category, sub_category)

    def get_working_directory(self) -> str:
        """
        Get Absolute Path Of Scripts Directory
        :return:  Absolute Path Of the Scripts Directory
        """
        working_file = os.path.realpath(__file__)
        re_match = re.match(r'^(.*[\\\/])', working_file)
        if re_match:
            return re_match.group(0)

    def get_config(self, config_path, category, subcategory):
        # Check config file exists
        path = pathlib.Path(config_path)
        if path.exists() and path.is_file():
            # Get configs
            try:
                with open(path) as ymlfile:
                    config = yaml.full_load(ymlfile)
                if subcategory:
                    config = config[category][subcategory]
                else:
                    config = config[category]
                if category == 'postgres':
                    config['db_uri'] = '{}://{}:{}@{}/{}'.format(
                        config['db_psql_base_uri'],
                        config['db_username'],
                        config['db_password'],
                        config['db_host'],
                        config['db_name']
                    )
                return config

            except IOError as ioe:
                logger.error(
                    "Cannot fetch settings from config file: {}".format(
                        path), ioe.with_traceback())

        else:
            logger.error(
                "Invalid file path: {}".format(config_path))
        return None

    @staticmethod
    def configure(category: str,
                  sub_category: Union[str, None] = None,
                  config_path: Union[str,None] = None) -> dict:
        return GetConfig("func", category, sub_category, config_path).config

    def __call__(self, cls: object, *args, **kwargs) -> Callable:
        self.__class__.__name__ = cls.__name__

        class Wrapped(cls, *args, **kwargs):
            config = self.config

            def __init__(self, *args, **kwargs):
                for key in self.config.keys():

                    if isinstance(self.config[key], dict):
                        setattr(self, key, Map(self.config[key]))
                    else:
                        setattr(self, key, self.config[key])
                cls.__init__(self, *args, **kwargs)

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
