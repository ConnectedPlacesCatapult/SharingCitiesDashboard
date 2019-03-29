""" config file for Celery Instance """

# Redis broker
BROKER_URL = 'redis://localhost:6379/0'

# Redis backend
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
