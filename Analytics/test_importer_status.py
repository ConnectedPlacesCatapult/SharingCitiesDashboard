import unittest
from datetime import datetime

import numpy

from app import create_app
from models.importer_status import ImporterStatuses
from models.api import API
from models.users import Users


class ImporterStatusTestCase(unittest.TestCase):
    """
    Test whether an admin user can request the statuses of the importers
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

    def test_request_for_status_success(self):
        """
        Test whether the expected response code and body is returned when
        there are entries in the importer status table
        """

        time_limit = datetime.now()
        importer_count = self.simulate_importers()
        access_token_header = self.generate_access_token()
        response = self.testing_client.get('/importer_status',
                                           headers=access_token_header)
        self.remove_importer_entries(time_limit)

        self.assertEqual(response.status_code, 200)
        self.assertIn(b"state", response.data)
        num_states_returned = len(response.get_json())
        self.assertEqual(num_states_returned, importer_count)

    def test_request_for_status_failure(self):
        """
        Test whether the expect response code and body is returned when
        there are no entries in the importer status table
        """

        access_token_header = self.generate_access_token()
        response_fail = self.testing_client.get('/importer_status',
                                                headers=access_token_header)
        self.assertEqual(response_fail.status_code, 200)
        num_states_returned = len(response_fail.get_json())
        self.assertEqual(num_states_returned, 0)

    def generate_access_token(self) -> dict:
        """
        Remove the entries that were persisted in the simulate_importer method
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

    @staticmethod
    def simulate_importers() -> int:
        """
        Persist a simulated importer status for each of the entries in
        the api table
        :return: the number of importer statuses added
        """
        states = ["pending", "success", "failure"]
        apis = API.get_all()
        number_of_importers = 0
        for api in apis:
            importer_state = numpy.random.choice(states, 1, True,
                                                 [0.1, 0.6, 0.3])[0]
            if importer_state == "failure":
                reason = "Exceeded daily limit"
            else:
                reason = ""

            new_importer = ImporterStatuses(api.id, api.api_class,
                                            importer_state,
                                            reason, "",
                                            datetime.now())
            new_importer.save()
            new_importer.commit()
            number_of_importers += 1

        return number_of_importers

    @staticmethod
    def remove_importer_entries(limit: datetime):
        """
        Remove the entries that were persisted by the simulate_importer method
        :param limit: the date and time limit after which entries should be
                      deleted
        """

        ImporterStatuses.remove_where(limit)


