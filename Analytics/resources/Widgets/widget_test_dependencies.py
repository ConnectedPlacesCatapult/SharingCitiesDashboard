import json
from typing import NoReturn

import bcrypt
from flask.testing import FlaskClient

from app import create_app
from db import db
from models.users import Users
from models.widget import WidgetModel
from models.widget_layout import Layouts


class TestDependencies:
    """
    Creates the dependencies needed to execute tests on the widgets
    """

    def __init__(self):
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

    def get_widget_data(self) -> {str: any}:
        """
        Gets widget data from a file for testing
        :return: json data used to create a widget on a users dashboard
        """
        with open('widget_test_data.json') as active_file:
            json_data = json.load(active_file)
        return json_data

    def make_dummy_widgets(self, number_of_widgets: int = 1) -> [int]:
        """
        Creates widgets for tests
        :param number_of_widgets: the number of widgets to create
        :type number_of_widgets:    int
        :return: A list of the widget ids created
        """
        widget_ids = []
        for _ in range(number_of_widgets):
            new_widget = WidgetModel(self.user.id, Layouts(-1, 0, 0, 5, 5, False), self.get_widget_data())
            db.session.add(new_widget)
            db.session.flush()
            # new_widget.layout.layout.widget_id = new_widget.id
            db.session.commit()
            widget_ids.append(new_widget.id)

        return widget_ids

    def remove_all_widgets(self) -> NoReturn:
        """
        Removes all widgets created for the tests
        """
        # Get all widgets with the admin user id
        response = self.client.post('/widgets/load_widgets',
                                    json=dict(userID=self.user.id, limit="1000"),
                                    headers=self.auth_header, follow_redirects=True)
        json_response = response.get_json()
        # check the type of reponse recieved
        if isinstance(json_response, dict):
            if response.get_json()['error'] == 'no widgets found for userID {}'.format(self.user.id):
                # No widgets were found so return
                return
        # Widgets were found, cleanup by removing them
        for widget in response.get_json():
            if widget["userID"] == self.user.id:
                widget_instance = WidgetModel.get_widget_by_id(widget["id"])
                print("Deleting dummy widget: {}".format(widget_instance.id))
                db.session.delete(widget_instance)
                db.session.commit()

    def clean_up(self) -> NoReturn:
        """
        Cleans up all dependencies created for the tests
        """
        # User cleanup
        self.remove_all_widgets()
        db.session.delete(self.user)
        db.session.commit()
        db.session.expunge_all()
        # test app cleanup
        self.app_context.pop()
