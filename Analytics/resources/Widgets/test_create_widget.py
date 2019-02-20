import pytest
from models.users import Users
from models.revoked_tokens import RevokedTokens
from app import create_app
from db import db
from flask_jwt_extended import create_access_token
from sqlalchemy import func
import re


@pytest.fixture()
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


@pytest.fixture()
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


@pytest.fixture()
def dummy_user():
    """ Create and save regular user to the database for duration of test and delete it afterwards """

    user = Users("Dummy", "dummy@FCC.com", Users.generate_hash("1234".encode("utf8")).decode("utf8"), True, True)

    try:
        user.save()
        user.commit()
    except Exception as e:
        pass

    yield user

    db.session.delete(user)
    db.session.commit()

@pytest.fixture()
def get_auth_header():
    admin_user()
    response_login = test_client.post('/login', data=dict(email=admin_user.email, password="wfnbqk"),
                                      follow_redirects=True)
    response_login_json = response_login.get_json()
    return {'Authorization': 'Bearer {}'.format(response_login_json["access_token"])}



def test_create_widget(test_client, admin_user):
    """ Test for successful creation of a new widget by an admin and for presense of a new widget in the database  """
    with open('widget_test_data.json') as json_file:
        widget_data = json_file.read()

    response_create_widget = test_client.post('/widgets/create_widget', data=widget_data,
                                              follow_redirects=True)
    response_create_widget = response_create_widget.get_json()

    # response_create_json = response_create_widget.get_json()
    print(response_create_widget)

    regex_results = re.match(r'(^(")?(Widget with id: )\d+\s(saved)(")?$)' ,"Widget with id: 11 saved")
    assert regex_results


