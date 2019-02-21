import json
import re

import pytest

from app import create_app
from db import db
from models.users import Users
from models.widget import WidgetModel
from models.widget_layout import Layouts


@pytest.fixture(scope="module")
def test_client():
    """
        Initialise Flask application, save the current application context for duration of single
        test and yield testing client for making requests to  endpoints exposed by  application
    """
    test_app = create_app(DATABASE_NAME='test_analysis', TESTING=True)
    testing_client = test_app.test_client()

    test_app_context = test_app.app_context()
    test_app_context.push()

    yield testing_client

    test_app_context.pop()


@pytest.fixture(scope="module")
def admin_user():
    """ Create and save admin user to the database for duration of test and delete it afterwards """

    user = Users("Admin", "admin@FCC.com", Users.generate_hash("wfnbqk".encode("utf8")).decode("utf8"), True, True)

    try:
        user.save()
        user.commit()
    except Exception as e:
        pass

    yield user

    db.session.delete(user)
    db.session.commit()


@pytest.fixture(scope="module")
def user_id(admin_user):
    """ Stores the to be used by tests user id """
    return Users.find_by_email(admin_user.email).id


@pytest.fixture(scope="module")
def widget_id():
    """ Stores the to be used by tests widget id"""
    widget_id = -1
    return widget_id


@pytest.fixture(scope="module")
def get_auth_header(test_client, admin_user):

    """ Retrieves the JWT authorization token and creates the authorization headers for the tests"""

    # Login
    response_login = test_client.post('/login', data=dict(email=admin_user.email, password="wfnbqk"),
                                      follow_redirects=True)
    response_login_json = response_login.get_json()
    # Create Auth header
    auth_header = {'Authorization': 'Bearer {}'.format(response_login_json["access_token"])}

    yield auth_header

    # logout
    test_client.post('/logout', follow_redirects=True)


@pytest.fixture()
def dummy_json_data():

    """ Reads widget data in from the file 'widget_test_data.json' and formats into JSON for the tests"""

    # Get widget data from the file
    with open('widget_test_data.json') as json_file:
        widget_data = json_file.read()
    # format the 
    widget_json_data = json.loads(widget_data)

    return widget_json_data


@pytest.fixture(scope="module")
def dummy_widget(admin_user, user_id):
    """ Creates dummy widget entry and handles clean up after use """

    # create dummy widget & persist it to the database
    layout = Layouts(1, 2, 3, 4, 5, True)
    widget = WidgetModel(user_id, layout, json.loads("{ \"data\" : \"fish\" }"))

    db.session.add(widget)
    db.session.flush()
    layout.widget_id = widget.id

    db.session.commit()

    yield widget

    # Delete dummy widget
    try:
        db.session.delete(widget)
    except:
        pass
    db.session.commit()


@pytest.fixture()
def dummy_layout(test_client, dummy_widget, get_auth_header):
    """ Creates dummy layout entry and handles clean up after use """

    # create and persist layout
    layout = Layouts(dummy_widget.id, 2, 3, 4, 5, True)
    dummy_widget.layout = layout
    db.session.add(layout)
    db.session.commit()

    yield layout

    # delete layout from the database
    db.session.delete(layout)
    db.session.commit()


def test_fetch_layouts(test_client, dummy_layout, user_id, get_auth_header):
    """ Fetches layouts related to the dummy admin user from the database"""
    #   Request layouts from layouts tabel
    response = test_client.post('/widgets/get_layouts', json=({"userID": user_id}), headers=get_auth_header,
                                follow_redirects=True)
    # Check response for htp status 200 (ok)
    assert response.status_code == 200




def test_create_delete_widget(test_client, admin_user, get_auth_header, dummy_json_data, user_id, widget_id):
    """ Test for successful creation and deletion of a new widget """

    # Check user id is an Integer.
    assert isinstance(user_id, int)

    # create widget
    response_create_widget = test_client.post('/widgets/create_widget', json=dummy_json_data, headers=get_auth_header,
                                              follow_redirects=True)

    # Is the http status code in the response 200 (OK)
    assert response_create_widget.status_code == 200

    # Format response message to get widget id
    response_create_widget = response_create_widget.get_json()

    # Check response message is the correct message before extracting the widgetID
    match_found = regex_results = re.match(r'(^(")?(Widget with id: )\d+\s(saved)(")?$)', response_create_widget)
    if match_found:
        # Correct response get widgetID
        widget_id_match = re.search(r'(\d)+', response_create_widget)
        if widget_id_match:
            # Got a widgetID
            widget_id = int(widget_id_match.group(0))
            # Check the id is an Integer
            assert isinstance(widget_id, int)

        else:
            # Not an widgetID as it is not an Integer
            assert False
    else:
        # Did not get expect response
        assert False

    # Clean up by deleting widget
    response_delete_widget = test_client.post('/widgets/delete_widget', json=dict(userID=user_id, widgetID=widget_id),
                                              headers=get_auth_header, follow_redirects=True)

    # Check response is successful with a http status code of 200 (OK)
    assert response_delete_widget.status_code == 204


def test_delete_widget(test_client, admin_user, get_auth_header, dummy_widget, user_id):
    """ tests that a widget can be removed from the data base and its related layout """

    # Delete widget
    response_delete_widget = test_client.post('/widgets/delete_widget', json=dict(userID=user_id,
                                widgetID=dummy_widget.id), headers=get_auth_header, follow_redirects=True)

    assert response_delete_widget.status_code == 204

    # Check the layouts entry no longer persists after the related widget is deleted
    results = db.engine.execute("SELECT * FROM layouts WHERE widget_id = {};".format(dummy_widget.id))
    entries = [row[0] for row in results]

    assert len(entries) == 0

def test_fetch_widgets_by_user(test_client, admin_user, get_auth_header, dummy_widget, user_id):
    response = test_client.post('/widgets/load_widgets', json=dict(userID=user_id,limit=10),
                                headers=get_auth_header, follow_redirects=True)
    assert response.status_code == 200

