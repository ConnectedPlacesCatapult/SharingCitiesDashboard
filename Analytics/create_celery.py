""" Create, initialise and return a Celery instance """

from __future__ import absolute_import

import logging

import flask
from celery import Celery

import celeryconfig

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


def make_celery(app: flask.app.Flask) -> Celery:
    """
    Instantiate a Celery object, configure broker/backend settings and
    wrap Celery's task execution in the flask apps context
    :param app: The Flask application
    """

    celery = Celery(app.import_name)
    celery.config_from_object(celeryconfig)
    celery.conf.update(app.config)
    logger.info("Celery configurations: BROKER_URL= {} RESULT_BANKEND = {} "
                "".format(celery.conf.get("BROKER_URL"),
                          celery.conf.get("CELERY_RESULT_BACKEND")))

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery
