import unittest

from app import create_app
from models.users import Users


class ForgotPasswordTestCase(unittest.TestCase):
    """
    Test whether user can request and receive a prediction task asynchronously
    """

    def setUp(self):
        """ Create testing client version of flask app """
        self.test_app = create_app(DATABASE_NAME='test_analytics',
                                   TESTING=True)
        self.testing_client = self.test_app.test_client()
        self.testing_client_context = self.test_app.app_context()
        self.testing_client_context.push()

    def tearDown(self):
        """ Remove testing client context """

        self.testing_client_context.pop()

    def test_async_prediction(self):
        """
        Test whether the correct response is sent when a user makes an async
        requests for a prediction
        """

        response = self.testing_client.get(
            '/data?limit=100&attributedata=NO2&predictions=True'
            '&n_predictions=200&per_sensor=True')
        self.assertIn(b"Forecasting engine making predictions", response.data)
        self.assertIn(b"task_id", response.data)

    def test_async_polling_and_reception(self):
        """
        Test whether a user can poll the /predict_status endpoint for the
        state of their async request
        """

        response = self.testing_client.get(
            '/data?limit=100&attributedata=NO2&predictions=True'
            '&n_predictions=200&per_sensor=True')
        self.assertIn(b"Forecasting engine making predictions", response.data)
        self.assertIn(b"task_id", response.data)
        response_json = response.get_json()
        task_id = response_json[1]["task_id"]

        response_poll = self.testing_client.get("/pred_status?task_id={}"
                                                .format(task_id))
        response_poll_json = response_poll.get_json()
        while response_poll_json["state"] in ["PENDING","PROGRESS"]:
            response_poll = self.testing_client.get("/pred_status?task_id={}"
                                                    .format(task_id))
            response_poll_json = response_poll.get_json()

        self.assertEqual(response_poll_json["state"], "SUCCESS")

