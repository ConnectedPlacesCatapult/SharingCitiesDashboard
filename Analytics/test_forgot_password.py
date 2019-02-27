import unittest

from app import create_app
from models.users import Users


class ForgotPasswordTestCase(unittest.TestCase):
    """
    Test user can reset their password using the forgot password endpoint
    """

    def setUp(self):
        """
        Create testing client version of flask app and persist a
        temporary user
        """
        self.test_app = create_app(DATABASE_NAME='test_analytics',
                                   TESTING=True)
        self.testing_client = self.test_app.test_client()
        self.testing_client_context = self.test_app.app_context()
        self.testing_client_context.push()

        self.dummy_user = Users("Joey", "joey@FCC.com",
                                Users.generate_hash( "1234".encode(
                                 "utf8")).decode("utf8"), True, True)
        self.dummy_user.save()
        self.dummy_user.commit()

    def tearDown(self):
        """ Remove temporary user from database"""

        self.testing_client_context.pop()
        self.dummy_user.delete()
        self.dummy_user.commit()

    def test_forgot_password(self):
        """
        Test forgot password sets user's password to a system generated
        password
        """

        forgotten_password = self.dummy_user.password
        response = self.testing_client.post('/forgot_password', data=dict(
            email=self.dummy_user.email))
        self.assertIn(b"success", response.data)
        self.assertEquals(response.status_code, 200)
        updated_user = Users.find_by_email(self.dummy_user.email)
        self.assertNotEqual(updated_user.password, forgotten_password)

    def test_forgot_password_failure(self):
        """ Test authentication failure and correct status code """
        response = self.testing_client.post('/forgot_password', data=dict(
            email="fakemail@gmail.com"))
        self.assertIn(b"cannot find user", response.data)
        self.assertEquals(response.status_code, 403)


if __name__ == '__main__':
    unittest.main()
