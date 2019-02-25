import pytest
from app import create_app
from db import db

@pytest.fixture()
def test_client():
	""" Create API client for testing the endpoints exposed by the Flask application """
	
	test_app = create_app(DATABASE_NAME='fcc_dump', TESTING=True)
	testing_client = test_app.test_client()

	test_app_context = test_app.app_context()
	test_app_context.push()

	yield testing_client

	test_app_context.pop()

@pytest.mark.parametrize("sensor_param_value", ["all",\
 												"60bd5e24-49f5-49b5-8dc2-be4932fba2cf",\
 												"e021b6ab-5eca-4490-b0c9-21d47d9b8957",\
 												"fb818331-b70c-4fc4-884c-f166e42dbf50",\
 												"0b62af0b-a34d-42c0-a55c-c6a6d0c665e5",\
 												"64e0de07-d273-484c-a48c-8091e48dca49",\
 												"466f292b-2229-499e-8b92-c1c4235852d3",\
 												"0b62af0b-a34d-42c0-a55c-c6a6d0c665e5",\
 												"11551206-2fac-4ec3-ade8-f8bf9645f4ff",\
 												"496af333-165e-4e10-953b-c6f675480bbc"
 												])
def test_sensor_params(test_client, sensor_param_value):
	""" Test for correct functionality of /sensor endpoint when sensor parameters are passed """
	
	data = "sensor"
	param = "sensor"

	response_fcc_enpoint = test_client.get('/data?{}={}'.format(param,sensor_param_value))
	response_dotmodus_enpoint = test_client.get('/data/{}?{}={}'.format(data,param,sensor_param_value))
	assert response_dotmodus_enpoint.data == "response_fcc_enpoint.data"
	assert response_dotmodus_enpoint.status_code == response_fcc_enpoint.status_code

@pytest.mark.parametrize("sensorname_param_value", ["BikePoints_3",\
 												"BikePoints_772, BikePoints_548",\
 												"BX1",\
 												"HR1",\
 												"ST6",\
 												"smart_parking_130, smart_parking_134, smart_parking_10",\
 												"smart_parking_2_16"
 												])
def test_sensorname_params(test_client, sensorname_param_value):
	""" Test for correct functionality of /sensor endpoint when sensorname parameters are passed """
	
	data = "sensor"
	param = "sensorname"

	response_fcc_enpoint = test_client.get('/data?{}={}'.format(param,sensorname_param_value))
	response_dotmodus_enpoint = test_client.get('/data/{}?{}={}'.format(data,param,sensorname_param_value))
	assert response_dotmodus_enpoint.data == response_fcc_enpoint.data
	assert response_dotmodus_enpoint.status_code == response_fcc_enpoint.status_code

@pytest.mark.parametrize("sensorattribute_param_value", ["60bd5e24-49f5-49b5-8dc2-be4932fba2cf",\
														"e021b6ab-5eca-4490-b0c9-21d47d9b8957",\
														"fb818331-b70c-4fc4-884c-f166e42dbf50,0b62af0b-a34d-42c0-a55c-c6a6d0c665e5",\
														"0b62af0b-a34d-42c0-a55c-c6a6d0c665e5,64e0de07-d273-484c-a48c-8091e48dca49,466f292b-2229-499e-8b92-c1c4235852d3",\
														"11551206-2fac-4ec3-ade8-f8bf9645f4ff",\
														"496af333-165e-4e10-953b-c6f675480bbc"
														])
def test_sensorattribute_params(test_client, sensorattribute_param_value):
	""" Test for correct functionality of /sensor endpoint when sensorattribute parameters are passed """
	
	data = "sensor"
	param = "sensorattribute"

	response_fcc_enpoint = test_client.get('/data?{}={}'.format(param,sensorattribute_param_value))
	response_dotmodus_enpoint = test_client.get('/data/{}?{}={}'.format(data,param,sensorattribute_param_value))
	assert response_dotmodus_enpoint.data == response_fcc_enpoint.data
	assert response_dotmodus_enpoint.status_code == response_fcc_enpoint.status_code
	
