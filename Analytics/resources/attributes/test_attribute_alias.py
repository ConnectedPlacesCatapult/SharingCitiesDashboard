from http import HTTPStatus
from unittest import TestCase

import bcrypt
from flask.ctx import AppContext
from flask.testing import FlaskClient

from app import create_app
from db import db
from models.attribute_alias import AttrAlias
from models.attributes import Attributes
from models.theme import SubTheme, Theme
from models.unit import Unit
from models.users import Users


class TestAttrAlias(TestCase):
    """
    Unittest Attribute Alias, Test Endpoints and Database persistence.
    """

    def setUp(self):
        """
        Setup a FlaskClient, AppContext, Admin user, Authorization header for requests to
        the Flask Client and a dummy Theme
        """
        self.client, self.app_context = self.create_test_client()
        self.user = self.create_admin_user()
        self.auth_header = self.get_auth_header()
        self.unit = Unit("_test_unit_type_", "A test unit")
        self.unit.save()
        self.unit.commit()
        self.attribute = Attributes.get_by_name("_test_attribute_")
        self.theme = self.create_dummy_theme()
        self.subtheme = self.create_dummy_subtheme()
        if not self.attribute:
            self.attribute = Attributes("1234567890-123456789-123456789", "_test_attribute_", "_table_name_",
                                        self.subtheme.id, self.unit.id)
            self.attribute.save()
            self.attribute.commit()

        self.clean_up = [self.user, self.attribute, self.theme, self.subtheme, self.theme, self.unit]

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
            subtheme = SubTheme.get_by_name('_TEST_SUB_THEME_')
        return subtheme

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

    def get_dummy_alias(self) -> db.Model:
        """
        Create dummy AttrAlias
        :return: A AttrAlias
        """
        alias = AttrAlias.get_by(name="_custom_name")
        if not alias:
            alias = AttrAlias(self.attribute.id, self.user.id, name="_custom_name", table_name="_table_name_",
                              description="a custon description")
            alias.save()
            alias.commit()
            self.clean_up.append(alias)
        return alias

    def test_create_alias(self) -> None:
        """
        Create AttrAlias database entry using database session
        """
        alias = AttrAlias(self.attribute.id, self.user.id, name="_custom_name", table_name="_table_name_",
                          description="a custon description")
        self.assertTrue(alias, msg="test_create_alias(): Failed to create Alias")
        if alias:
            self.clean_up.append(alias)

    def test_create_alias(self) -> None:
        """ Create AttrAlias using endpoint and check client response for https status code 200"""
        json_payload = {"user_id": self.user.id, "attribute_id": self.attribute.id, "name": "A_Custom_Name_12890",
                        "table_name": "_A_TaBlE_NaMe_"}
        response = self.client.post('/admin/attributes/alias', json=json_payload, headers=self.auth_header)
        if response.status_code == HTTPStatus.OK:
            alias = AttrAlias.get_by(user_id=self.user.id, name="A_Custom_Name_12890")
            if alias:
                self.clean_up.append(alias)
        self.assertEqual(response.status_code, HTTPStatus.OK)

    def test_update_alias(self) -> None:
        """ Update AttrAlias using endpoint, Check client response for https status code 200 and update table_name"""
        alias = self.get_dummy_alias()
        json_payload = {"user_id": self.user.id, "attribute_id": self.attribute.id, "name": "A_Custom_Name_12890",
                        "table_name": "_UpDaTeD_TaBlE_NaMe_"}
        response = self.client.post('/admin/attributes/alias', json=json_payload, headers=self.auth_header)
        if response.status_code == HTTPStatus.OK:
            alias = AttrAlias.get_by(user_id=self.user.id, name="A_Custom_Name_12890")
            if alias:
                self.clean_up.append(alias)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(alias.table_name, "_UpDaTeD_TaBlE_NaMe_")

    def test_delete_alias(self) -> None:
        """Delete AttrAlias using endpoint and check client response for https status code 204"""
        alias = self.get_dummy_alias()
        self.assertTrue(alias)
        json_payload = {"user_id": self.user.id, "attribute_id": self.attribute.id}
        response = self.client.post('/admin/attributes/delete_alias', json=json_payload, headers=self.auth_header)
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT)

    def delete(self, module: db.Model) -> None:
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

        map(self.delete,self.clean_up)
        self.app_context.pop()
