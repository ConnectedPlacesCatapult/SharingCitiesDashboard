from http import HTTPStatus
from unittest import TestCase

import bcrypt
from flask.ctx import AppContext
from flask.testing import FlaskClient

from app import create_app
from db import db
from models.attributes import Attributes
from models.theme import SubTheme, Theme
from models.unit import Unit
from models.users import Users


class TestGetAttributes(TestCase):
    """ Test get_attribute endpoint """

    def setUp(self) -> None:
        """
        Setup FlaskClient for tests, create an admin user and create the authorization header for requests to
        the FlaskClient
        """
        self.clean_up = []
        self.client, self.app_context = self.create_test_client()
        self.user = self.create_admin_user()
        self.theme = self.create_dummy_theme()
        self.subtheme = self.create_dummy_subtheme()
        self.unit = self.get_dummy_unit()
        self.attribute = Attributes("A_TEST_ATTRIBUTE_ID_", "_TEST_ATTR_NAME_", "_A_TABLE_NAME", self.subtheme.id,
                                    self.unit.id, description="_A_CUSTOM_DESCRIPTION_")
        self.attribute.save()
        self.attribute.commit()
        self.clean_up.append(self.attribute)

    def create_test_client(self) -> (FlaskClient, AppContext):
        """
        Create FlaskClient and AppContext
        :return:    FlaskClient and AppContext
        """
        test_app = create_app(DATABASE_NAME='test_analysis', TESTING=True)
        testing_client = test_app.test_client()
        test_app_context = test_app.app_context()
        test_app_context.push()
        return testing_client, test_app_context

    def create_dummy_theme(self) -> Theme:
        """
        Create a Theme
        :return: a Theme
        """
        theme = Theme.get_by_name("_test_add_theme_")
        if not theme:
            theme = Theme("_test_add_theme_")
            theme.save()
            theme.commit()
            self.clean_up.append(theme)
            return theme
        return theme

    def create_dummy_subtheme(self) -> SubTheme:
        """
        Create SubTheme
        :return: SubTheme
        """
        subtheme = SubTheme.get_by_name('_TEST_SUB_THEME_')
        if not subtheme:
            subtheme = SubTheme(self.theme.id, '_TEST_SUB_THEME_')
            subtheme.save()
            subtheme.commit()
            self.clean_up.append(subtheme)
            subtheme = SubTheme.get_by_name('_TEST_SUB_THEME_')
        return subtheme

    def get_dummy_unit(self):
        unit = Unit.get_by_symbol("_A_UNIT_FOR_TESTING")
        if not unit:
            unit = Unit("_A_UNIT_FOR_TESTING", "_A_TEST_UNIT_DESCRIPTION_")
            unit.save()
            unit.commit()
        if unit not in self.clean_up:
            self.clean_up.append(unit)

        return unit

    def create_admin_user(self) -> Users:
        """
        Create Admin user
        :return: an admin user
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
        self.clean_up.append(user)
        return user

    def get_auth_header(self) -> {str: str}:
        """
        Create an Authorization header
        :return: An authorization header
        """
        response_login = self.client.post('/login', data=dict(email=self.user.email, password="wfnbqk", remember=True),
                                          follow_redirects=True)
        response_login_json = response_login.get_json()
        return {'Authorization': 'Bearer {}'.format(response_login_json["access_token"])}

    def test_get_all_attributes(self) -> None:
        """ Fetch all Attributes using endpoint"""
        response = self.client.get('/admin/attributes/get_attributes')
        self.assertEqual(response.status_code, HTTPStatus.OK)

    def test_get_attribute_by_id(self) -> None:
        """ Fetch Attribute by id using endpoint"""
        query_string_data = {"attribute_id": self.attribute.id}
        response = self.client.get('/admin/attributes/get_attributes', data=query_string_data)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        json_response = response.get_json()
        self.assertEqual(json_response[0]["id"], self.attribute.id, msg="Attribute id does not match")
        self.assertEqual(json_response[0]["name"], self.attribute.name, msg="Attribute name does not match")

    def delete(self, module: db.Model) -> None:
        """
        Delete db>Model instances from the database
        :param module: Model to be deleted
        :type module: db>Model
        """
        module.delete()
        module.commit()

    def tearDown(self) -> None:
        """
        Clean up dependencies
        """
        self.subtheme.delete()
        self.subtheme.commit()

        self.theme.delete()
        self.theme.commit()
        db.engine.execute("DELETE FROM attributes WHERE id = 'A_TEST_ATTRIBUTE_ID_'")
        # self.delete(self.attribute)

        self.unit.delete()
        self.unit.commit()

        self.user.delete()
        self.user.commit()

        map(self.delete, self.clean_up)
        self.app_context.pop()
