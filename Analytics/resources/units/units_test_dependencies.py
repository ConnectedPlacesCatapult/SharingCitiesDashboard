from typing import NoReturn

import bcrypt
from flask.testing import FlaskClient

from app import create_app
from db import db
from models.users import Users


class TestDependencies:
    """
    Creates the dependencies needed to execute tests on the widgets
    """
    def __init__(self) -> None:
        """
        Initialises the dependencies required for the widget tests
        """
        self.app_context = None
        self.client = self.create_test_client()
        self.user = self.create_admin_user()
        self.auth_header = self.get_auth_header()

        try:
            self.user.save()
            self.user.commit()
        except Exception as e:
            pass

    def create_test_client(self) -> FlaskClient:
        """
        Creates a flask client for testing
        :return: A flask client
        """
        test_app = create_app(DATABASE_NAME='test_analysis', TESTING=True)
        testing_client = test_app.test_client()
        test_app_context = test_app.app_context()
        test_app_context.push()
        self.app_context = test_app_context
        return testing_client

    @staticmethod
    def create_admin_user() -> Users:
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

    def clean_up(self) -> NoReturn:
        """
        Cleans up all dependencies created for the tests
        """
        # User cleanup
        db.session.delete(self.user)
        db.session.commit()
        db.session.expunge_all()
        # test app cleanup
        self.app_context.pop()
