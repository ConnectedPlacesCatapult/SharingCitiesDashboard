import logging
import os
import re
from typing import Callable, Any, Union

import yaml

from .configurations import Configurations

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class GetConfig(object):
    """
    GetConfig decorator
    """

    def __init__(self, cls_name: str, category: Union[str, None] = None,
                 sub_category: Union[str, None] = None,
                 config_path: Union[str, None] = None) -> None:
        """
        Check Settings File exists, Create Path, Get Configurations from file
        :param cls_name: Name of Calling Class
        :param category: Configurations Category
        :param sub_category: Sub Configuration Category
        :param config_path:  Absolute Path to custom configurations file
        """
        self.name = cls_name
        if not config_path:
            self.working_dir = self.get_working_directory()
            config_path = os.path.join(self.working_dir, 'config.yml')

        self.config = Configurations.get_configurations(config_path)
        if category:
            self.config = self.extract_sub_config(category,
                                                  subcategory=sub_category)
            if category == 'postgres':
                self.config['db_uri'] = '{}://{}:{}@{}/{}'.format(
                    self.config['db_psql_base_uri'],
                    self.config['db_username'],
                    self.config['db_password'],
                    self.config['db_host'],
                    self.config['db_name']
                )
                self.config['SQLALCHEMY_DATABASE_URI'] = "{}://{}:{}@{}/{}".format(
                    self.config['db_psql_base_uri'],
                    self.config['db_username'],
                    self.config['db_password'],
                    self.config['db_host'],
                    self.config['db_name']
                )



    @staticmethod
    def get_working_directory() -> str:
        """
        Get Absolute Path Of Scripts execution directory
        :return:  Absolute Path Of the Scripts execution directory
        """
        working_file = os.path.realpath(__file__)
        re_match = re.match(r'^(.*[\\\/])', working_file)
        if re_match:
            return re_match.group(0)

    def extract_sub_config(self, category: str,
                           subcategory: Union[str, None] = None) -> {str: Any}:
        """
        Get Configurations in Category and Subcategory
        :param category: The Configurations Category
        :param subcategory: The Configurations Subcategory
        :return: The Configuration in the Category and/or Subcategory
        """
        self.config = self.config[category]
        if subcategory:
            self.config = self.config[subcategory]

        return self.config

    @staticmethod
    def configure(category: Union[str, None] = None,
                  sub_category: Union[str, None] = None,
                  config_path: Union[str, None] = None) -> {str: Any}:
        """
        Get Configurations by using the decorator as a function
        :param category: Configurations Category
        :param sub_category: Configurations SubCategory
        :param config_path: Absolute Path to Configurations file
        :return: The Configurations from the parsed Category and/or Subcategory
        """
        if category:
            return GetConfig("func", category, sub_category,
                             config_path).config
        else:
            if not config_path:
                working_dir = GetConfig.get_working_directory()
                config_path = os.path.join(working_dir, 'config.yml')
            return Configurations.get_configurations(config_path)

    @staticmethod
    def save_config(config: {str: Any},
                    config_path: Union[str, None] = None) -> None:
        """
        Commit Configuration changes to yaml Config file
        :param config: Configuration dictionary to be committed to file
        :param config_path: Absolute path to file to commit changes configurations
        """
        try:
            if not config_path:
                working_dir = GetConfig.get_working_directory()
                config_path = os.path.join(working_dir, 'config.yml')

            with open(config_path, 'w') as config_file:
                yaml.safe_dump(config, config_file)

            Configurations.update_config(config_path)

        except IOError as ioe:
            logger.error("An error occurred committing configurations yaml"
                         " file", ioe.with_traceback(ioe.__traceback__))

    def __call__(self, cls: object, *args: Any, **kwargs: dict) -> Callable:
        """
        Decorate Class, Create required class attributes. Call the Wrapped
        Callable
        :param cls: The Class Object to being decorated
        :param args: Additional arguments
        :param kwargs: Additional Keyword arguments
        :return: The Wrapped Callable
        """
        self.__class__.__name__ = cls.__name__

        class Wrapped(cls, *args, **kwargs):
            """
            Wrap Decorated Callable, Get Configurations and Create required
            attributes in the Decorated Callable. Finally Call the Callable
            :param cls: The Class Object to being decorated
            :param args: Additional arguments
            :param kwargs: Additional Keyword arguments
            :return: The Wrapped Callable
            """
            config = self.config

            def __init__(self, *args: Any, **kwargs: dict):
                """
                Override Classes __init__ method. Create the Configuration
                attributes. Call the Decorated class __init__ method.
                :param cls: The Class Object to being decorated
                :param args: Additional arguments
                :param kwargs: Additional Keyword arguments
                """
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
