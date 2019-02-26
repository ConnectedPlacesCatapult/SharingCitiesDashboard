import pytest

from app import create_app
from db import db
from models.users import Users
from sqlalchemy.exc import IntegrityError

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


@pytest.fixture()
def test_client():
    """
    Initialises the Flask application, save the current application context for
    the duration of a single test and yield a testing client that can be
    used for making requests to the endpoints exposed by the application
    """
    test_app = create_app(DATABASE_NAME='test_analytics', TESTING=True)
    testing_client = test_app.test_client()

    test_app_context = test_app.app_context()
    test_app_context.push()

    yield testing_client

    test_app_context.pop()


@pytest.fixture()
def dummy_user() -> db.Model:
    """
    Create and save regular user to the database for duration of test
    and  delete it afterwards
    """

    user = Users("James", "james@dotmodus.com", Users.generate_hash(
        "1234".encode("utf8")).decode("utf8"), True, True)

    try:
        user.save()
        user.commit()
        yield user
        db.session.delete(user)
        db.session.commit()
    except IntegrityError as ie:
        logger.error("Cannot delete user {} as they do not exist".format(user.email))


def test_forgot_password(test_client, dummy_user: db.Model):
    """
    Test whether email is sent successfully and password has changed in
    the database
    """
    
    current_user = Users.find_by_email(dummy_user.email)
    forgotten_password = current_user.password

    response_forgot = test_client.post('/forgot_password', data=dict(
        email=current_user.email), follow_redirects=True)
    response_forgot_json = response_forgot.get_json()
    assert "success" in response_forgot_json["message"]
    assert response_forgot.status_code == 200

    updated_user = Users.find_by_email(dummy_user.email)
    assert forgotten_password != updated_user.password
