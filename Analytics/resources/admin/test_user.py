from typing import NoReturn

from resources.admin.user_test_dependencies import TestDependencies
from models.users import Users

dependencies = None


def setup_module() -> NoReturn:
    """
    Setup the dependencies need for the tests.
    + Sets up FlaskClient
    + Creates an admin user
    + Logs in admin user
    + Makes Authorization header with JWT token
    + Provides helper functions for tests
    """
    global dependencies
    dependencies = TestDependencies()


def teardown_module() -> NoReturn:
    """
    Tears down the dependencies need for the tests.
    + Removes all widgets and layouts from the database created for the tests
    + Logs out admin user
    + Removes admin user
    + Pops flask test client
    """
    global dependencies
    dependencies.clean_up()


def test_create_user():
    """tests the user creation"""
    global dependencies
    new_user = dependencies.get_dummy_user()
    same_user = Users.find_by_email(new_user.email)
    assert same_user is new_user
    new_user.delete()
    new_user.commit()


def test_create_user_endpoint():
    """
    tests the '/admin/create_new_user' endpoint
    """
    global dependencies
    print(dependencies.user.id)
    json_data = {"email": "email@email.com",
                 "fullname": "fullname",
                 "admin": True,
                 "password": "top_secret"
                 }
    response = dependencies.client.post('/admin/create_new_user', json=json_data,
                                        headers=dependencies.auth_header,
                                        follow_redirects=True)
    assert response.status_code == 201
    user = Users.find_by_email('email@email.com')
    if user:
        user.delete()
        user.commit


def test_user_email_duplication():
    """
    test that duplication of a user email is not possible
    """
    json_data = {"email": "email@email.com",
                 "fullname": "fullname",
                 "admin": True,
                 "password": "password"
                 }
    new_user = Users("fullname", 'piet123@gmail.com', Users.generate_hash('top_secret'.encode("utf-8")), True, True)
    new_user.save()
    new_user.commit()
    response = dependencies.client.post('/admin/create_new_user', json=json_data,
                                        headers=dependencies.auth_header,
                                        follow_redirects=True)
    assert response.status_code == 400
    new_user.delete()
    new_user.commit()


def test_change_user_fullname():
    """
    tests the user name is changed using the '/admin/change_user_fullname' endpoint
    """
    user = dependencies.get_dummy_user()
    json_data = {"email": user.email, "fullname": "asdfghjkl"}
    response = dependencies.client.post('/admin/change_user_fullname', json=json_data,
                                        headers=dependencies.auth_header,
                                        follow_redirects=True)
    user = Users.find_by_email(user.email)
    assert user.fullname == "asdfghjkl"

    user.delete()
    user.commit()


def test_change_user_password():
    """
    tests that the user password is changed using the '/admin/change_user_password' endpoint
    """
    user = dependencies.get_dummy_user()
    json_data = {"email": "james.bond@email.com", "password": "mysecretpassword", "verify_password": "mysecretpassword"}
    response = dependencies.client.post('/admin/change_user_password', json=json_data,
                                        headers=dependencies.auth_header,
                                        follow_redirects=True)
    user = Users.find_by_email()
