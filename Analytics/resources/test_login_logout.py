import pytest 
from models.users import Users
from models.revoked_tokens import RevokedTokens
from app import create_app
from db import db
from flask_jwt_extended import create_access_token
from sqlalchemy import func


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



def test_login_correct_details(test_client, dummy_user):
	""" Tests whether the correct response message, response code and corresponding access and refresh tokens are
	    returned when the correct login credentials are supplied 
	"""
	
    response = test_client.post('/login', data=dict(email=dummy_user.email, password="wfnbqk"), follow_redirects=True)
    response_json = response.get_json()
    assert "Logged in as" in response_json["message"]
    assert response_json["access_token"] != None
    assert response_json["refresh_token"] != None
    assert response.status_code == 200

    db.session.delete(dummy_user)
    db.session.commit()

def test_login_incorrect_details(test_client, dummy_user):
	""" Tests whether an unsuccessful response message and response code are returned when the incorrect login credentials are supplied 
	    and ensures that no access or refresh JWT is issued
	"""
    response = test_client.post('/login', data=dict(email="not_a_user@FCC.com", password="wfnbqk"), follow_redirects=True)
    response_json = response.get_json()
    assert "Incorrect credentials. Please try again" in response_json["message"]
    assert "access_token" not in response_json
    assert "refresh_token" not in response_json
    assert response.status_code == 403

    response = test_client.post('/login', data=dict(email=dummy_user.email, password="wk"), follow_redirects=True)
    response_json = response.get_json()
    assert "Incorrect credentials. Please try again" in response_json["message"]
    assert "access_token" not in response_json
    assert "refresh_token" not in response_json
    assert response.status_code == 403

    db.session.delete(dummy_user)
    db.session.commit()


def test_revoke_access(test_client,dummy_user):
	""" Tests whether when a access JWT is revoked that the the token is added to the revoked tokens table and that a user is
	    is not able to use that token on subsequent requests
	"""
    response_login = test_client.post('/login', data=dict(email="user@FCC.com", password="wfnbqk"), follow_redirects=True)
    response_login_json = response_login.get_json()
    header = {'Authorization': 'Bearer {}'.format(response_login_json["access_token"])}   

    number_of_Entries = db.session.query(func.count(RevokedTokens.id)).scalar()
    response_revoke_access = test_client.post('/revokeAccess', headers=header, follow_redirects=True)
    assert b"Access token has been revoked" in response_revoke_access.data
    assert db.session.query(func.count(RevokedTokens.id)).scalar() > number_of_Entries

    response = test_client.get('/secret', headers=header)
    assert b"Token has been revoked" in response.data

    db.session.delete(dummy_user)
    db.session.commit()

def test_revoke_refresh(test_client,dummy_user):
	""" Tests whether when a refresh JWT is revoked that the the token is added to the revoked tokens table and that a user is
	    is not able to use that token to generate new access JWTs
	"""
    response_login = test_client.post('/login', data=dict(email="user@FCC.com", password="wfnbqk"), follow_redirects=True)
    response_login_json = response_login.get_json()
    header = {'Authorization': 'Bearer {}'.format(response_login_json["refresh_token"])}   

    number_of_Entries = db.session.query(func.count(RevokedTokens.id)).scalar()
    response_revoke_refresh = test_client.post('/revokeRefresh', headers=header, follow_redirects=True)
    assert b"Refresh token has been revoked" in response_revoke_refresh.data
    assert db.session.query(func.count(RevokedTokens.id)).scalar() > number_of_Entries

    response = test_client.post('/refreshToken', headers=header)
    assert b"Token has been revoked" in response.data

    db.session.delete(dummy_user)
    db.session.commit()


def test_refresh_token(test_client,dummy_user):
	""" Tests whether when supplied a refresh JWT, this endpoint provides a new access token that can be used to access other restricted endpoints """
    response_login = test_client.post('/login', data=dict(email="user@FCC.com", password="wfnbqk"), follow_redirects=True)
    response_login_json = response_login.get_json()
    header = {'Authorization': 'Bearer {}'.format(response_login_json["refresh_token"])}   

    response_refresh_token = test_client.post('/refreshToken', headers=header, follow_redirects=True)
    response_refresh_json = response_refresh_token.get_json()
    response_refresh_json["access_token"] != None

    header = {'Authorization': 'Bearer {}'.format(response_refresh_json["access_token"])} 
    response = test_client.get('/secret', headers=header)
    assert b"42" in response.data

    db.session.delete(dummy_user)
    db.session.commit()






