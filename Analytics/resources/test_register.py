import pytest 
from models.users import Users
from app import create_app
from db import db

@pytest.fixture()
def test_client():
	""" A fixture that initialises the Flask application, saves the current application context for the duration of a single
	    test and yields a testing client that can be used for making requests to the endpoints exposed by the application
	"""
	test_app = create_app(DATABASE_NAME='test_analysis', TESTING=True)
	testing_client = test_app.test_client()

	test_app_context = test_app.app_context()
	test_app_context.push()

	yield testing_client

	test_app_context.pop()

@pytest.fixture()
def dummy_user():
	""" Creates and saves a user to the database that is to be used for testing purposes """
	
    not_activated = Users("Not Activated","not_activated@FCC.com",Users.generate_hash("1234".encode("utf8")).decode("utf8"),True,False)

    not_activated.save()
    not_activated.commit()

    return not_activated

def test_correct_details(test_client, dummy_user):
	""" Test whether the expected response message and response code is returned when an existing user attempts to activate their account 
	    with the correct credentials
	"""
    assert dummy_user.activated == False
    response = test_client.post('/register', data=dict(email=dummy_user.email, password="1234"), follow_redirects=True)
    assert b"account has been registered" in response.data
    assert response.status_code == 201
    assert dummy_user.activated == True
    db.session.delete(dummy_user)
    db.session.commit()

def test_incorrect_email(test_client):
	""" Test whether an unsuccessful response message and forbidden response code is returned when a user attempts to activate their account 
	    with the incorrect email
	"""
    response = test_client.post('/register', data=dict(email="not_a_user@FCC.com", password="1234"), follow_redirects=True)
    assert b"not authorised to access Sharing Cities Dashboard" in response.data
    assert response.status_code == 403

def test_incorrect_password(test_client, dummy_user):
	""" Test whether an unsuccessful response message and forbidden response code is returned when a user attempts to activate their account 
	    with the incorrect password
	"""
    assert dummy_user.activated == False
    response = test_client.post('/register', data=dict(email=dummy_user.email, password="1"), follow_redirects=True)
    assert b"The password entered does not correspond" in response.data
    assert response.status_code == 403
    assert dummy_user.activated == False
    db.session.delete(dummy_user)
    db.session.commit()

def test_invalid_inputs(test_client):
	""" Test whether the /register endpoint provides adequate error responses when invalid input is sent to it """
    response = test_client.post('/register', data=dict(email=None, password=None), follow_redirects=True)
    assert b"This field cannot be blank" in response.data
    assert response.status_code == 400
    response = test_client.post('/register', data=dict(email="", password=""), follow_redirects=True)
    assert b"not authorised to access Sharing Cities Dashboard" in response.data
    assert response.status_code == 403




