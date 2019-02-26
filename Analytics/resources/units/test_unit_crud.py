from typing import NoReturn

import pytest
from flask.wrappers import Response as Response

from models.unit import Unit
from resources.units.units_test_dependencies import TestDependencies

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


@pytest.fixture()
def dummy_unit() -> Unit:
    """
    Creates a dummy unit
    :yields: A unit instance
    """
    dummy_unit = Unit("NOT_A_SYMBOL", "DUMMY_DESCRIPTION")
    dummy_unit.save()
    dummy_unit.commit()
    yield dummy_unit
    dummy_unit.delete()
    dummy_unit.commit()


def request(endpoint_url: str, json_payload: str) -> Response:
    """
    Helper function to handle requests to the flask test client
    :param endpoint_url:    The path of the endpoint
    :type endpoint_url:     str
    :param json_payload:    The content to send in the requests body as application/json
    :type json_payload:     str
    :return:    The response from the flask testing client
    """
    global dependencies
    return dependencies.client.post(endpoint_url, json=json_payload, headers=dependencies.auth_header)


def test_add_unit() -> NoReturn:
    """
    Tests a new unit entry can be created using the '/admin/units/add' endpoint.
    """
    global dependencies
    json_payload = {"symbol": "NOT_A_SYMBOL", "description": "DUMMY_DESCRIPTION"}
    response = request('/admin/units/add', json_payload)
    assert response.status_code == 200
    response = request('/admin/units/delete', json_payload)
    assert response.status_code == 204


def test_get_unit_of_measure_with_symbol(dummy_unit: Unit) -> NoReturn:
    """
    Tests a unit instance can be retrieved from the database by the units symbol using the '/admin/units/get' endpoint.
    :param dummy_unit: a dummy unit yielded from a pytest fixture
    :type dummy_unit:  Unit
    """
    global dependencies
    json_payload = {"symbol": dummy_unit.symbol}
    response = request('/admin/units/get', json_payload)
    assert response.status_code == 200


def test_get_unit_of_measure_with_description(dummy_unit: Unit) -> NoReturn:
    """
    Tests a unit instance can be retrieved from the database by the units description using the '/admin/units/get'
    endpoint.
    :param dummy_unit: a dummy unit yielded from a pytest fixture
    :type dummy_unit:  Unit
    """
    global dependencies
    json_payload = {"description": dummy_unit.description}
    response = request('/admin/units/get', json_payload)
    assert response.status_code == 200


def test_delete_unit(dummy_unit: Unit) -> NoReturn:
    """
    Tests a unit entry can be deleted from the database by the units symbol using the '/admin/units/delete'
    endpoint.
    :param dummy_unit: a dummy unit yielded from a pytest fixture
    :type dummy_unit:  Unit
    """
    global dependencies
    json_payload = {"symbol": dummy_unit.symbol}
    response = request('/admin/units/delete', json_payload)
    assert response.status_code == 204


def test_delete_unit_not_found() -> NoReturn:
    """
    Tests the endpoint handles a not found condition correctly by return a http status code 404 not found when the
    Unit does not exist in the databse
    endpoint.
    :param dummy_unit: a dummy unit yielded from a pytest fixture
    :type dummy_unit:  Unit
    """
    global dependencies
    json_payload = {"symbol": "a@g5JDIE*&^%G"}
    response = request('/admin/units/delete', json_payload)
    assert response.status_code == 404


def test_list_all_units(dummy_unit: Unit) -> NoReturn:
    """
    Tests all unit instance can be retrieved from the database using the '/admin/units/get_all'
    endpoint.
    :param dummy_unit: a dummy unit yielded from a pytest fixture
    :type dummy_unit:  Unit
    """
    global dependencies
    json_payload = {"limit": 1}
    response = request('/admin/units/get_all', json_payload)
    assert response.status_code == 200


def test_update_unit(dummy_unit: Unit) -> NoReturn:
    """
    Tests a unit can be updated using the '/admin/units/update' endpoint
    :param dummy_unit: a unit to be used for the
    :param dummy_unit: a dummy unit yielded from a pytest fixture
    :type dummy_unit:  Unit
    """
    global dependencies
    json_payload = {"symbol": "NOT_A_SYMBOL", "new_symbol": "PEANUT_BUTTER", "new_description": "PEANUT_BUTTER"}
    response = request('/admin/units/update', json_payload)
    assert response.status_code == 200

    unit = Unit.get_by_symbol("PEANUT_BUTTER")
    if not unit:
        assert False
        return

    assert unit.description == "PEANUT_BUTTER"
    assert unit.symbol == "PEANUT_BUTTER"

