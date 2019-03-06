import unittest
from http import HTTPStatus
from unittest import TestCase

import bcrypt
from flask.ctx import AppContext
from flask.testing import FlaskClient

from app import create_app
from models.theme import Theme, SubTheme
from models.users import Users


class TestSubTemes(TestCase):
    """
    Unittest for the creation, renaming and deleting of Themes
    """

    def setUp(self):
        """
        Setup a FlaskClient for testing, creates an admin user and creates the authorization header for requests to
        the Flask Client and a dummy theme
        """
        self.client, self.app_context = self.create_test_client()
        self.user = self.create_admin_user()
        self.auth_header = self.get_auth_header()

        self.theme = Theme.get_by_name("_test_add_Subtheme_")
        if not self.theme:
            self.theme = Theme("_test_add_Subtheme_")
            self.theme.save()
            self.theme.commit()
            self.theme = Theme.get_by_name("_test_add_Subtheme_")
        self.subtheme = self.create_dummy_subtheme()

    def create_test_client(self) -> (FlaskClient, AppContext):
        """
        Create flask testing client
        :return: FlaskClient for tests and AppContext
        """
        test_app = create_app(DATABASE_NAME='test_analysis', TESTING=True)
        testing_client = test_app.test_client()
        test_app_context = test_app.app_context()
        test_app_context.push()
        return testing_client, test_app_context

    def create_dummy_subtheme(self) -> SubTheme:
        """
        Create SubTheme for tests
        :return: SubTheme for tests
        """
        subtheme = SubTheme.get_by_name('_TEST_SUB_THEME_')
        if not subtheme:
            subtheme = SubTheme(self.theme.id, '_TEST_SUB_THEME_')
            subtheme.save()
            subtheme.commit()
            subtheme = SubTheme.get_by_name('_TEST_SUB_THEME_')
        return subtheme

    def create_admin_user(self) -> Users:
        """
        Create Admin user for tests
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
        Create an Authorization header for test
        :return: An authorization header
        """
        response_login = self.client.post('/login', data=dict(email=self.user.email, password="wfnbqk", remember=True),
                                          follow_redirects=True)
        response_login_json = response_login.get_json()
        return {'Authorization': 'Bearer {}'.format(response_login_json["access_token"])}

    def test_add_subtheme(self):
        """
        Create a new SubTheme and check the client response status code for http status 200 (OK)
        Check JSON response data for the expected message 'New theme created' and
        Theme name
        """
        response = self.client.post('/admin/themes/add_subtheme',
                                    json={"theme_id": self.theme.id, "subtheme": "_TEST_SUB_THEME_2"},
                                    headers=self.auth_header)

        self.assertEqual(response.status_code, HTTPStatus.OK)
        json_response = response.get_json()
        self.assertEqual(json_response["message"], "sub theme created")
        self.assertEqual(json_response["theme_id"], self.theme.id)
        self.assertEqual(json_response["subtheme"], "_TEST_SUB_THEME_2")

    def test_rename_subtheme_theme_id(self):
        """
        Rename a SubTheme by theme_id and check the clients response status code for http status 200 (OK)
        Check response data for the expected message 'Subtheme renamed' and the
        Subtheme name has been changed
        """
        if not self.subtheme:
            self.subtheme = self.create_dummy_subtheme()
        current_name = self.subtheme.name
        response = self.client.post('/admin/themes/rename_subtheme', json={"theme_id": self.subtheme.t_id,
                                                                           "current_name": current_name,
                                                                           "new_name": "_____________________"
                                                                           }, headers=self.auth_header)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        response = response.get_json()
        self.assertEqual(response["id"], self.subtheme.id)
        self.assertEqual(response["message"], "Subtheme renamed")
        self.assertEqual(response["old_name"], current_name)
        self.assertEqual(response["new_name"], "_____________________")

    def test_rename_subtheme_id(self):
        """
        Rename a SubTheme by id and check the clients response status code for http status 200 (OK)
        Check response data for the expected message 'Subtheme renamed' and the
        Subtheme name has been changed
        """
        if not self.subtheme:
            self.subtheme = self.create_dummy_subtheme()
        current_name = self.subtheme.name
        response = self.client.post('/admin/themes/rename_subtheme', json={"id": self.subtheme.id,
                                                                           "current_name": current_name,
                                                                           "new_name": "_____________________"
                                                                           }, headers=self.auth_header)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        response = response.get_json()
        self.assertEqual(response["id"], self.subtheme.id)
        self.assertEqual(response["message"], "Subtheme renamed")
        self.assertEqual(response["old_name"], current_name)
        self.assertEqual(response["new_name"], "_____________________")

    def test_rename_non_existant_subtheme(self):
        """
        Rename a SubTheme that does not exist and check the clients response status code for http status 404 (OK)
        """
        response = self.client.post('/admin/themes/rename_subtheme', json={"theme_id": -1,
                                                                           "current_name": "a3d4f5g6h7j8k0",
                                                                           "new_name": "_____________________"
                                                                           }, headers=self.auth_header)
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)

    def test_delete_non_exsitant_subtheme(self):
        """
        Delete a SubTheme that does not exist and check the client response status code for http status 404
        """
        if not self.subtheme:
            self.subtheme = self.create_dummy_subtheme()
        response = self.client.post('/admin/themes/delete_subtheme',
                                    json={"name": "weA_gfj24fhurtyui", "theme_id": -1},
                                    headers=self.auth_header)
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)

    def test_delete_subtheme_by_id(self):
        """
        Delete a SubTheme by id and check the client response status code for http status 204 (NO_CONTENT)
        """
        if not self.subtheme:
            self.subtheme = self.create_dummy_subtheme()
        response = self.client.post('/admin/themes/delete_subtheme', json={"id": self.subtheme.id},
                                    headers=self.auth_header)
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT)

    def test_delete_subtheme_by_theme_id_and_name(self):
        """
        Delete a SubTheme by theme_id and name: check the client response status code for http status 204 (NO_CONTENT)
        """
        if not self.subtheme:
            self.subtheme = self.create_dummy_subtheme()
        response = self.client.post('/admin/themes/delete_subtheme',
                                    json={"theme_id": self.subtheme.t_id, "name": self.subtheme.name},
                                    headers=self.auth_header)
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT)

    def tearDown(self):
        """ Handle the cleanup after tests"""

        self.subtheme = SubTheme.get_by_name("_____________________")
        if not self.subtheme:
            self.subtheme = SubTheme.get_by_name("_TEST_SUB_THEME_")

        if self.subtheme:
            self.subtheme.delete()
            self.subtheme.commit()

        test_sub = SubTheme.get_by_name("_TEST_SUB_THEME_2")
        if test_sub:
            test_sub.delete()
            test_sub.commit()
        if self.theme:
            self.theme.delete()
            self.theme.commit()

        self.client.post('/logout', headers=self.auth_header)

        if self.user:
            self.user.delete()
            self.user.commit()

        self.app_context.pop()


if __name__ == '__main__':
    unittest.main()
