import unittest
from datetime import datetime

from app import create_app
from models.importer_status import ImporterStatuses
from models.users import Users


class ImporterRetryEndpointTestCase(unittest.TestCase):
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

    def test_request_for_retry_success(self):
        """
        Test whether the correct response is returned when a importer
        retry succeeds
        """
        importer = ImporterStatuses.find_by_api_id(2)
        current_timestamp = importer.timestamp
        access_token_header = self.generate_access_token()
        response = self.testing_client.post('/importer_retry', data=dict(
            api_id=importer.api_id), headers=access_token_header)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"success", response.data)
        updated_importer = ImporterStatuses.find_by_api_id(2)
        self.assertGreater(updated_importer.timestamp, current_timestamp)

    def test_request_for_retry_failure(self):
        """
        Test whether the correct response is returned when a importer
        retry fails
        """
        access_token_header = self.generate_access_token()
        response = self.testing_client.post('/importer_retry', data=dict(
            api_id=999999), headers=access_token_header)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"could not be found", response.data)

    def generate_access_token(self) -> dict:
        """
        Generate admin access JWT.
        :return: a HTTP authorization header containing a admin access token
        """

        admin_user = Users("Admin user", "admin@FCC.com",
                           Users.generate_hash(b"1234").decode("utf8"), True,
                           True)
        admin_user.save()
        admin_user.commit()
        response_login = self.testing_client.post('/login', data=dict(
            email="admin@FCC.com", password="1234", remember=True))
        response_login_json = response_login.get_json()
        admin_user.delete()
        admin_user.commit()
        return {'Authorization': 'Bearer {}'.format(
            response_login_json["access_token"])}
