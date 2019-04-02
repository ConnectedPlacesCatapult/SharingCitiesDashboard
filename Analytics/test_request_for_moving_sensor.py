import unittest

from app import create_app


class RequestMovingSensorDataTestCase(unittest.TestCase):
    """
    Test whether an admin user can request for a retry of a failed importer
    """

    def setUp(self):
        """ Create testing client version of flask app """

        self.test_app = create_app(DATABASE_NAME='scheduler',
                                   TESTING=True)
        self.testing_client = self.test_app.test_client()
        self.testing_client_context = self.test_app.app_context()
        self.testing_client_context.push()

    def tearDown(self):
        """ Remove testing client context """

        self.testing_client_context.pop()

    def test_request_for_themes(self):
        """
        Test whether the correct Theme is returned when the moving param
        is set to True
        """
        theme_param = 'all'
        response = self.testing_client.get('/data?moving=True&theme=' +
                                           theme_param)
        self.assertIn(b"Moving_Sensor",response.data)

    def test_request_for_subtheme(self):
        """
        Test whether the correct subtheme is returned when the moving param
        is set to True
        """
        subtheme_param = 'all'
        response = self.testing_client.get('/data?moving=True&subtheme=' +
                                           subtheme_param)
        self.assertIn(b"Moving_Airquality", response.data)

    def test_request_for_sensor(self):
        """
        Test whether the correct sensors are returned when the moving param
        is set to True
        """
        sensor_param = 'all'
        response = self.testing_client.get('/data?moving=True&sensor=' +
                                           sensor_param)
        self.assertIn(b"2018", response.data)
        self.assertIn(b"2020", response.data)
        self.assertIn(b"2021", response.data)
        self.assertIn(b"2022", response.data)
        self.assertIn(b"2025", response.data)
