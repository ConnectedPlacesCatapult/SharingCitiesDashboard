import logging
import os
import re
from pathlib import Path
from typing import Any, Union

import yaml

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class Configurations(object):
    """
    Get configurations from yaml file
    """
    __instance = None
    __config_lib = dict()
    __config_changed = dict()

    @staticmethod
    def get_configurations(config_path: Union[str, Path, None] = None) -> dict:
        """
        Get configurations from config library. if configuration is not in the
        config library get the configurations from the parses yaml file
        :param config_path: Absolute path to configurations file
        :return: Configurations
        """
        if config_path in Configurations.__config_lib:
            return Configurations.__config_lib[config_path]
        else:
            Configurations(config_path)

        return Configurations.__config_lib[config_path]

    def __init__(self, config_path: Union[str, Path]) -> None:
        """
        Get Instance of Configurations, if the instance does not exist create a
        new instance.
        :param config_path: Absolute path to configurations file
        """

        # if Configurations.__instance is not None:
        #     raise Exception("Configurations have already been loaded")
        # else:
        Configurations.__instance = self
        if config_path:
            Configurations.__config_lib[
                config_path] = self.get_config_from_file(config_path)

    @staticmethod
    def extract_sub_config(config: {str: Any}, category: str,
                           subcategory: Union[str, None] = None) -> {str: Any}:
        """
        Extract Configuration from Category and/or Subcategory
        :param config: Configurations Dictionary
        :param category: Configurations Category
        :param subcategory: Configurations Subcategory
        :return: Configurations from parsed Category and/or Subcategory
        """
        config = config[category]
        if subcategory:
            config = config[subcategory]

        return config

    @staticmethod
    def get_working_directory() -> str:
        """
        Get the Absolute Path Of the scripts execution directory
        :return:  Absolute Path Of the scripts execution directory
        """
        working_file = os.path.realpath(__file__)
        re_match = re.match(r'^(.*[\\\/])', working_file)
        if re_match:
            return re_match.group(0)

    @staticmethod
    def check_file_exists(config_path: Path) -> Union[Path, None]:
        """
        Check the Absolute Path exists and is a file
        :param config_path: Absolute path to configurations file
        :return: Path otherwise raise an IOError
        :raises IOError: Raise if the config_path does not exist or is not a file
        """
        # Check config file exists
        path = Path(config_path)
        if path.exists() and path.is_file():
            return path
        raise IOError("Configurations file not found: {}".format(path))

    @classmethod
    def get_config_from_file(cls, config_path: Union[Path, str]) -> {str: Any}:
        """
        Get Configurations from config file
        :param config_path: Absolute Path to configurations file
        :return: Configurations loaded from configurations file
        """
        try:
            path = Configurations.check_file_exists(config_path)
            with open(path) as yml_file:
                config = yaml.safe_load(yml_file)
                return config
        except IOError as ioe:
            logger.error(
                "Cannot fetch settings from config file: {}".format(
                    config_path), ioe.with_traceback(None))

    @staticmethod
    def update_config(config_path: Union[Path, str]) -> None:
        """
        Force update Configuration by removing the configurations from the
        configurations library
        :param config_path: Absolute Path to configurations file
        """
        Configurations.__config_lib.pop(config_path, None)
