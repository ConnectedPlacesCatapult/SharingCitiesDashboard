import copy
from settings.get_config_decorator import GetConfig

config = GetConfig.configure('celery')
# Redis broker
BROKER_URL = copy.deepcopy(config["BROKER_URL"])

# Redis backend
CELERY_RESULT_BACKEND = copy.deepcopy(config["CELERY_RESULT_BACKEND"])