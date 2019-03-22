import logging
import unittest
from http import HTTPStatus
from unittest import TestCase

import bcrypt
from flask.ctx import AppContext
from flask.testing import FlaskClient

from app import create_app
from models.attribute_alias import AttrAlias
from models.attributes import Attributes
from models.theme import Theme, SubTheme
from models.unit import Unit
from models.users import Users

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class TestGetThemeTree(TestCase):

    def setUp(self):
        """
        Setup FlaskClient for tests, create an admin user and create the authorization header for requests to
        the FlaskClient
        """
        self.client, self.app_context = self.create_client()
        self.user = self.create_admin_user()
        self.auth_header = self.get_auth_header()
        self.units = []
        self.theme = None
        self.create_theme()
        self.sub_themes = []
        self.create_sub_themes(3)
        self.attributes = []
        self.create_attributes(4)
        self.aliases = []
        self.create_attribute_alias()

    @staticmethod
    def create_client() -> (FlaskClient, AppContext):
        """
        Create a FlaskClient
        :returns: A FlaskClient and a AppContext
        """
        test_app = create_app(DATABASE_NAME='test_analysis', TESTING=True)
        testing_client = test_app.test_client()
        test_app_context = test_app.app_context()
        test_app_context.push()
        return testing_client, test_app_context

    def create_theme(self) -> None:
        """
        Create a Theme
        """
        self.theme = Theme.get_by_name("_test_theme_")
        if self.theme:
            return

        self.theme = Theme("_test_theme_")
        self.theme.save()
        try:
            self.theme.commit()

        except Exception as exp:
            logger.error(exp)
            self.tearDown()

        if not self.theme:
            self.fail()

    def create_sub_themes(self, count: int) -> None:
        """
        Create SubThemes
        :param count: The number of SubThemes to create.
        """
        if self.theme:
            theme_id = self.theme.id
            for num in range(0, count):
                sub_theme = SubTheme(theme_id, "_test_sub_theme_{}".format(num))
                if sub_theme:

                    try:
                        sub_theme.save()
                        sub_theme.commit()
                        self.sub_themes.append(sub_theme)
                    except Exception as exp:
                        logger.error(exp)
                        self.tearDown()

    def create_unit(self, number: int) -> Unit:
        """
        Create unit/s
        :param number: a number to make the unit type unique
        """
        unit = Unit.get_by_symbol("Unit_type_{}".format(number))
        if unit:
            self.units.append(unit)
            return unit

        unit = Unit("Unit_type_{}".format(number), "Description_{}".format(number))
        unit.save()
        unit.commit()
        self.units.append(unit)
        return unit

    def create_attributes(self, count: int) -> None:
        """
        Create Attributes for SubThemes
        :param count: Number of Attributes per SubTheme
        """
        number_attributes = len(self.sub_themes) * count

        try:
            index = 0
            sub_theme = self.sub_themes[index]
            for num in range(0, number_attributes):

                unit = self.create_unit(num)
                attr = Attributes("attribute_id_{}".format(num),
                                  "attribute_name_{}".format(num),
                                  "b3_heat_value_bffc4e56_20e2_41a5_84d8_de725a3f875b",
                                  sub_theme.id, unit.id, "_test_description_{}".format(num), "1")
                attr.save()
                attr.commit()
                self.attributes.append(attr)

                if num % count:
                    index += 1
                    if index >= len(self.sub_themes):
                        return
                    sub_theme = self.sub_themes[index]

        except Exception as exp:
            logger.error(exp)
            self.fail()

    def create_attribute_alias(self) -> None:
        """
        Create Attributes Aliases for Attributes
        :param count: The number of attributes to create per SubTheme
        """
        try:
            for attr in self.attributes:
                alias = AttrAlias(attr.id, user_id=self.user.id, name="_alias_name {}".format(len(self.aliases)),
                                  table_name="_alias_table_name_{}".format(len(self.aliases)))

                alias.save()
                alias.commit()
                self.aliases.append(alias)

        except Exception as exp:
            logger.error(exp)
            self.tearDown()

    @staticmethod
    def create_admin_user() -> Users:
        """
        Create an Admin user
        :return: an Admin user
        """
        password_hash = bcrypt.hashpw("@p@22M0rd#@!".encode("utf-8"), bcrypt.gensalt())
        user = Users.find_by_email("test_admin_user@no_an_email.cr")
        if not user:
            user = Users("test_admin_user", "test_admin_user@no_an_email.cr", password_hash.decode("utf8"), True, True)
            try:
                user.save()
                user.commit()
            except Exception as e:
                pass
        return user

    def get_auth_header(self) -> {str: str}:
        """
        # Create an Authorization header
        :return: An Authorization header
        """
        response_login = self.client.post('/login',
                                          data=dict(email=self.user.email, password="@p@22M0rd#@!", remember=True),
                                          follow_redirects=True)
        response_login_json = response_login.get_json()
        return {'Authorization': 'Bearer {}'.format(response_login_json["access_token"])}

    def test_get(self) -> None:
        """
        Test Create Theme Tree endpoint
        """
        resp = self.client.get('/admin/themes/get_tree', data=dict(user_id=self.user.id, theme_id=self.theme.id),
                               headers=self.auth_header)
        data = resp.get_json()

        self.assertEqual(resp.status_code, HTTPStatus.OK)
        self.assertTrue('id' in data)
        self.assertTrue(data['id'] == self.theme.id)
        self.assertTrue(data['Name'] == self.theme.name)
        self.assertTrue('sub_themes' in data)
        self.assertTrue(len(data['sub_themes']) == len(self.sub_themes))
        for sub in data['sub_themes']:
            self.assertTrue("attributes" in sub)
            for attr in sub["attributes"]:
                self.assertTrue("alias" in attr)

    def tearDown(self) -> None:
        """ Clean up all dependencies after tests"""

        for alias in self.aliases:
            try:
                if AttrAlias.get_by_user_id(self.user.id):
                    alias.delete()
                    alias.commit()
            except Exception:
                pass

        for attr in self.attributes:
            try:
                if Attributes.get_by_id(attr.id):
                    attr.delete()
                    attr.commit()
            except Exception:
                pass

        for sub_theme in self.sub_themes:
            try:
                if SubTheme.get_by_id(sub_theme.id):
                    sub_theme.delete()
                    sub_theme.commit()
            except Exception:
                pass

        for unit in self.units:
            try:
                if Unit.get_by_id(unit.id):
                    unit.delete()
                    unit.commit()
            except Exception:
                pass

        try:
            if Theme.get_by_id(self.theme.id):
                self.theme.delete()
                self.theme.commit()
        except Exception:
            pass

        self.client.post('/logout', headers=self.auth_header)

        if self.user:
            if Users.find_by_id(self.user.id):
                try:
                    self.user.delete()
                    self.user.commit()
                except Exception:
                    pass

        self.app_context.pop()


if __name__ == '__main__':
    unittest.main()
