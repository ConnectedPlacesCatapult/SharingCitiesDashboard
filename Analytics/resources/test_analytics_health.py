import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import unittest
import json
from app import create_app
from test_setup_teardown import SetupTearDown


class AnalyticsHealthCheck(unittest.TestCase):
    """
    Test retrieving data from backend
    """

    def setUp(self):
        """
        Initialise Flask application, save the current application context for
        the duration of a single test and yield a testing client for making
        requests to the endpoints exposed by the application
        """
        self.test_app = create_app(DATABASE_NAME='test_analytics_2', TESTING=True)
        self.testing_client = self.test_app.test_client()

        self.testing_client_context = self.test_app.app_context()
        self.testing_client_context.push()

    def tearDown(self):
        """Remove testing client"""
        self.testing_client_context.pop()

    def test_health(self):
        response = self.testing_client.get('/')
        self.assertEqual(response.get_json(), {"healthy": True})
