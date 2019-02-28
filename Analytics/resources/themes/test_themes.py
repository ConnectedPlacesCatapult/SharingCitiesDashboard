import unittest
from http import HTTPStatus
from unittest import TestCase

import bcrypt
from flask.ctx import AppContext
from flask.testing import FlaskClient

from app import create_app
from models.theme import Theme
from models.users import Users


class TestAddTheme(TestCase):
    """
    Unittest for the creation, renaming and deleting of Themes
    """

    def setUp(self):
        """
        Sets up a FlaskClient for testing, creates an admin user and creates the authorization header for requests to
        the Flask Client
        """
        self.client, self.app_context = self.create_test_client()
        self.user = self.create_admin_user()
        self.auth_header = self.get_auth_header()
        self.dummy_ids = []

    def create_test_client(self) -> (FlaskClient, AppContext):
        """
        Creates a flask client for testing
        :returns: A flask client and a AppContext
        """
        test_app = create_app(DATABASE_NAME='test_analysis', TESTING=True)
        testing_client = test_app.test_client()
        test_app_context = test_app.app_context()
        test_app_context.push()
        return testing_client, test_app_context

    def create_dummy_theme(self) -> Theme:
        """
        Creates an theme for the tests
        :return: a Theme instance for tests
        """
        theme = Theme.get_by_name("_test_add_theme_")
        if not theme:
            theme = Theme("_test_add_theme_")
            theme.save()
            theme.commit()
            self.dummy_ids.append(theme.id)
            return theme
        return theme

    def create_admin_user(self) -> Users:
        """
        Creates an admin user for the tests
        :return: an admin user for tests
        """
        password_hash = bcrypt.hashpw("wfnbqk".encode("utf-8"), bcrypt.gensalt())
        user = Users.find_by_email("admin@FCC.com")
        if not user:
            user = Users("Admin", "admin@FCC.com", password_hash.decode("utf8"), True, True)
            try:
                user.save()
                user.commit()
            except Exception as e:
                pass
        return user

    def get_auth_header(self) -> {str: str}:
        """
        # Creates an Authorization header for testing endpoints
        :return: An authorization header
        """
        response_login = self.client.post('/login', data=dict(email=self.user.email, password="wfnbqk"),
                                          follow_redirects=True)
        response_login_json = response_login.get_json()
        return {'Authorization': 'Bearer {}'.format(response_login_json["access_token"])}

    def test_add_theme(self):
        response = self.client.post('/admin/themes/add_theme', json={"name": "_test_add_theme_"},
                                    headers=self.auth_header)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        json_response = response.get_json()
        self.dummy_ids.append(json_response["id"])
        self.assertEqual(json_response["message"], "New theme created")
        self.assertEqual(json_response["name"], "_test_add_theme_")

    def test_rename_theme(self):
        theme = self.create_dummy_theme()

        response = self.client.post('/admin/themes/rename_theme', json={"current_name": "_test_add_theme_",
                                                                        "new_name": "_emeht_dda_tset_"
                                                                        }, headers=self.auth_header)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        response = response.get_json()
        self.assertEqual(response["message"], "Theme renamed")
        self.assertEqual(response["new_name"], "_emeht_dda_tset_")

    def test_delete_theme(self):
        theme = self.create_dummy_theme()
        response = self.client.post('/admin/themes/delete_theme', json={"name": theme.name}, headers=self.auth_header)
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT)

    def tearDown(self):

        for theme_id in self.dummy_ids:
            theme = Theme.get_by_id(theme_id)
            if theme:
                theme.delete()
                theme.commit()

        self.client.post('/logout', headers=self.auth_header)

        if self.user:
            self.user.delete()
            self.user.commit()

        self.app_context.pop()


if __name__ == '__main__':
    unittest.main()
