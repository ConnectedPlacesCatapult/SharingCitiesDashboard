import pytest

from app import create_app
from db import db
from models.users import Users


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

    user = Users("Admin","admin@FCC.com",Users.generate_hash("wfnbqk".encode("utf8")).decode("utf8"),True,True)

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
    user = Users("Dummy","dummy@FCC.com",Users.generate_hash("1234".encode("utf8")).decode("utf8"),True,True)

    try:
    	user.save()
    	user.commit()
    except Exception as e:
    	pass
    

    yield user

    db.session.delete(user)
    db.session.commit()


def test_create_user(test_client,admin_user):
	""" Test for successful creation of a new user by an admin and for presense of user in the database  """

	response_login = test_client.post('/login', data=dict(email=admin_user.email, password="wfnbqk"), follow_redirects=True)
	response_login_json = response_login.get_json()
	header = {'Authorization': 'Bearer {}'.format(response_login_json["access_token"])}  

	response_create = test_client.post('/admin/create_new_user', data=dict(email="new@gmail.com",fullname="New User",admin="True",password="1234"), headers=header, follow_redirects=True)
	response_create_json = response_create.get_json()
	assert b"created successfull" in response_create.data
	assert response_create.status_code == 201
	assert Users.find_by_email("new@gmail.com") != None

	db.session.delete( Users.find_by_email("new@gmail.com"))
	db.session.commit()

def test_delete_user(test_client,admin_user,dummy_user):
	""" Test for successful deletion of a specified user by an admin and for absence of user in the database  """

	response_login = test_client.post('/login', data=dict(email=admin_user.email, password="wfnbqk"), follow_redirects=True)
	response_login_json = response_login.get_json()
	header = {'Authorization': 'Bearer {}'.format(response_login_json["access_token"])}  

	response_delete = test_client.delete('/admin/delete_user', data=dict(email=dummy_user.email), headers=header, follow_redirects=True)
	assert response_delete.status_code == 204
	assert Users.find_by_email(dummy_user.email) == None

def test_get_user(test_client,admin_user,dummy_user):
	""" Test that the correct user credentials are returned when passed a valid email """

	response_login = test_client.post('/login', data=dict(email=admin_user.email, password="wfnbqk"), follow_redirects=True)
	response_login_json = response_login.get_json()
	header = {'Authorization': 'Bearer {}'.format(response_login_json["access_token"])}  

	response_get = test_client.post('/admin/get_user_by_email', data=dict(email=dummy_user.email), headers=header, follow_redirects=True)
	assert response_get.status_code == 200
	assert dummy_user.email == response_get.get_json()["email"]


def test_edit_user(test_client,admin_user,dummy_user):
	""" Test that the changes a user makes to their fullname persists to the database """

	response_login = test_client.post('/login', data=dict(email=admin_user.email, password="wfnbqk"), follow_redirects=True)
	response_login_json = response_login.get_json()
	header = {'Authorization': 'Bearer {}'.format(response_login_json["access_token"])}  

	response_change = test_client.post('/admin/edit_user', data=dict(email=dummy_user.email, fullname="Not a dummy", password="new password", admin=False,activated=False), headers=header, follow_redirects=True)
	assert response_change.status_code == 200
	changed_user = Users.find_by_email(dummy_user.email)
	assert changed_user.fullname == "Not a dummy"
	assert Users.verify_hash("new password".encode("utf8"),dummy_user.password.encode("utf8")) == True
	assert changed_user.admin == False
	assert changed_user.admin == False

	


