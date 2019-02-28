import unittest
from http import HTTPStatus
from unittest import TestCase

import bcrypt
from flask.ctx import AppContext
from flask.testing import FlaskClient

from app import create_app
from models.unit import Unit
from models.users import Users


class TestAddTheme(TestCase):
    """
    Unittest for the creation, updating and deleting of Units
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

        unit = next(iter(Unit.get_by(_type="_NOT_A_UNIT_")), None)
        if unit:
            unit.delete()
            unit.commit()

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

    def create_dummy_unit(self) -> Unit:
        """
        Creates an Unit for the tests
        :return: a Unit instance for tests
        """
        unit = next(iter(Unit.get_by(_type="_NOT_A_UNIT_")), None)

        if not unit:
            unit = Unit("_NOT_A_UNIT_", "testunit")
            unit.save()
            unit.commit()
            self.dummy_ids.append(unit.id)
            return unit
        return unit

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

    def test_add_Unit(self):
        """
        Creates a new Unit and checks the client response status code for http status 200 (OK)
        The response JSON data is then checked for the expected message 'New unit created',
        _type and description
        """
        response = self.client.post('/admin/units/add_unit', json={"_type": "_NOT_A_UNIT_", "description": "testunit"},
                                    headers=self.auth_header)

        self.assertEqual(response.status_code, HTTPStatus.OK)
        json_response = response.get_json()
        self.dummy_ids.append(json_response["id"])
        self.assertEqual(json_response["message"], "New unit created")
        self.assertEqual(json_response["_type"], "_NOT_A_UNIT_")
        self.assertEqual(json_response["description"], "testunit")

    def test_update_unit(self):
        """
        Updates a unit and checks the client response status code for http status 200 (OK)
        The response JSON data is then checked that the id matches the unit updated and that the
        type and description is correct
        """
        unit = self.create_dummy_unit()

        response = self.client.post('/admin/units/update_unit', json={"_type": unit._type, "new_type": "<_NOT_A_UNIT_>",
                                                                      "new_description": "new_description"
                                                                      }, headers=self.auth_header)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        response = response.get_json()
        self.assertEqual(response["id"], unit.id)
        self.assertEqual(response["Type"], "<_NOT_A_UNIT_>")
        self.assertEqual(response["Description"], "new_description")

    def test_delete_unit_by_id(self):
        """
        Deletes a unit by its id and checks the client response status code for http status 204 (NO_CONTENT)
        """
        unit = self.create_dummy_unit()
        response = self.client.post('/admin/units/delete_unit', json={"id": unit.id}, headers=self.auth_header)
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT)

    def test_delete_unit_by_type(self):
        """
        Deletes a unit by its type and checks the client response status code for http status 204 (NO_CONTENT)
        """
        unit = self.create_dummy_unit()
        response = self.client.post('/admin/units/delete_unit', json={"_type": unit._type}, headers=self.auth_header)
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT)

    def tearDown(self):
        """ Handles the cleanup after the tests"""
        for unit_id in self.dummy_ids:
            unit = Unit.get_by_id(unit_id)
            if unit:
                unit.delete()
                unit.commit()

        self.client.post('/logout', headers=self.auth_header)

        if self.user:
            self.user.delete()
            self.user.commit()

        self.app_context.pop()


if __name__ == '__main__':
    unittest.main()
