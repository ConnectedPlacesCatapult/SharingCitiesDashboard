import copy
from settings.get_config_decorator import GetConfig

""" 
Set the the broker and backend configurations according to the settings 
defined in config.env.yaml 
"""

config = GetConfig.configure('celery')

BROKER_URL = copy.deepcopy(config["BROKER_URL"])

CELERY_RESULT_BACKEND = copy.deepcopy(config["CELERY_RESULT_BACKEND"])