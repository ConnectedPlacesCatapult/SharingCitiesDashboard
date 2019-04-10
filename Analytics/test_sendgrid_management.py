import unittest

from app import create_app
from models.users import Users


class SendgridManagementTestCase(unittest.TestCase):
    """
    Test whether the validity of the current Sendgrid API key can be tested
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

    def test_key_validity(self):
        """
        Test whether the current Sendgrid API key is valid
        """

        access_token_header = self.generate_access_token()
        response = self.testing_client.get('/sendgrid/test_key_validity',
                                           headers=access_token_header)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"true", response.data)

    def generate_access_token(self) -> dict:
        """
        Return an admin access JWT
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
