import unittest

from app import create_app
from models.users import Users
from models.user_predictions import UserPredictions


class CelryTestCase(unittest.TestCase):
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

        self.dummy_user = Users("Joey", "joey@FCC.com",
                                Users.generate_hash("1234".encode(
                                    "utf8")).decode("utf8"), True, True)
        self.dummy_user.save()
        self.dummy_user.commit()

    def tearDown(self):
        """ Remove testing client context """

        self.testing_client_context.pop()

        self.dummy_user.delete()
        self.dummy_user.commit()

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

    def test_adding_prediction_per_user(self):
        """
        Test whether a prediction result is associated with a user in the
        userpredictions table
        """

        response = self.testing_client.get(
            '/data?limit=3&attributedata=NO2&predictions=True'
            '&n_predictions=3')
        self.assertIn(b"Forecasting engine making predictions", response.data)
        self.assertIn(b"task_id", response.data)
        response_json = response.get_json()
        task_id = response_json[1]["task_id"]

        response_poll = self.testing_client.get("/pred_status?task_id={}"
                                                .format(task_id))

        response_poll_json = response_poll.get_json()
        while response_poll_json["state"] in ["PENDING", "PROGRESS"]:
            response_poll = self.testing_client.get("/pred_status?task_id={}"
                                                    .format(task_id))
            response_poll_json = response_poll.get_json()

        self.assertEqual(response_poll_json["state"], "SUCCESS")
        self.assertIsNotNone(response_poll_json["result"]["Prediction_id"])
