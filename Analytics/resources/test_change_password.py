import pytest 
from models.users import Users
from app import create_app
from db import db
from flask_jwt_extended import create_access_token

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
	""" A fixture that creates and saves a user to the database that is to be used for testing purposes """
	
    user = Users("User","user@FCC.com",Users.generate_hash("wfnbqk".encode("utf8")).decode("utf8"),True,True)

    user.save()
    user.commit()

    return user



def test_correct_details(test_client, dummy_user):
	""" Tests whether the success response message and response code is returned when a user submits the correct email and password
	    as well as whether the password has been updated in the database  
	"""
    old_password = dummy_user.password
    access_token = create_access_token(identity = dummy_user)
    header = {'Authorization': 'Bearer {}'.format(access_token)}
    response = test_client.patch('/changePassword', data=dict(email=dummy_user.email, password_old="wfnbqk", password_new="abcd"), follow_redirects=True, headers=header)
    assert b"Password has been updated" in response.data
    assert response.status_code == 200
    assert dummy_user.password != old_password

    db.session.delete(dummy_user)
    db.session.commit()

def test_incorrect_old_password(test_client, dummy_user):
	""" Tests whether the unsuccessful response message and response code is returned when a user submits the incorrect email and password
	    as well as whether there is no change to the user's password in the database 
	"""
    old_password = dummy_user.password
    access_token = create_access_token(identity = dummy_user)
    header = {'Authorization': 'Bearer {}'.format(access_token)}
    response = test_client.patch('/changePassword', data=dict(email=dummy_user.email, password_old="123", password_new="abcd"), follow_redirects=True, headers=header)
    assert b"Incorrect credentials" in response.data
    assert response.status_code == 403
    assert dummy_user.password == old_password

    db.session.delete(dummy_user)
    db.session.commit()


def test_invalid_inputs(test_client,dummy_user):
	""" Test whether the /changePassword endpoint provides adequate error responses when invalid input is sent to it """
    access_token = create_access_token(identity = dummy_user)
    header = {'Authorization': 'Bearer {}'.format(access_token)}
    response = test_client.patch('/changePassword', data=dict(email=None, password_old=None, password_new=None), follow_redirects=True, headers=header)
    assert b"This field cannot be blank" in response.data
    assert response.status_code == 400

    db.session.delete(dummy_user)
    db.session.commit()
