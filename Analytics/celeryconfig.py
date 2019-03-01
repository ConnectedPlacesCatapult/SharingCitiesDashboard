""" config file for Celery Instance """

# # default RabbitMQ broker
# BROKER_URL = 'amqp://'
#
# # default RabbitMQ backend
# CELERY_RESULT_BACKEND = 'amqp://'

# Redis broker
BROKER_URL = 'redis://localhost:6379/0'

# Redis backend
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

