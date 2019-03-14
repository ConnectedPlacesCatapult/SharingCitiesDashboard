import pytest
from app import create_app
from db import db


@pytest.fixture()
def test_client():
	""" 
	Initialise Flask application, save the current application context for
	the duration of a single test and yield a testing client for making 
	requests to the endpoints exposed by the application
	"""
	test_app = create_app(DATABASE_NAME='fcc_dump', TESTING=True)
	testing_client = test_app.test_client()

	test_app_context = test_app.app_context()
	test_app_context.push()

	yield testing_client

	test_app_context.pop()


@pytest.mark.parametrize("attribute_param_value", [
								"temperature",
								"NO2,SO2",
								"energy_consumed",
								"b1_flow_value,b1_temp_out_value, b1_temp_back_value"])
def test_attribute_params(test_client, attribute_param_value):
	""" 
	Test whether the proposed /data endpoint functions the same as the 
	current one for the attribute parameter 
	"""

	data = "attribute"
	param = "attribute"

	response_fcc_enpoint = test_client.get(
		'/data?{}={}'.format(
			param,
			attribute_param_value))
	response_dotmodus_enpoint = test_client.get(
		'/data/{}?{}={}'.format(
			data,
			param,
			attribute_param_value))
	assert response_dotmodus_enpoint.data == response_fcc_enpoint.data
	assert response_dotmodus_enpoint.status_code == response_fcc_enpoint.status_code


@pytest.mark.parametrize("attributedata_param_value", [
	"temperature",
	"NO2,SO2",
	"energy_consumed",
	"b1_flow_value,b1_temp_out_value, b1_temp_back_value"
	])
def test_attributedata_params(test_client, attributedata_param_value):
	""" 
	Test whether the proposed /data endpoint functions the same as the 
	current one for the attributedata parameter 
	"""

	data = "attribute"
	param = "attributedata"

	response_fcc_enpoint = test_client.get(
		'/data?{}={}'.format(
			param,
			attributedata_param_value))
	response_dotmodus_enpoint = test_client.get(
		'/data/{}?{}={}'.format(
			data,
			param,
			attributedata_param_value))
	assert response_dotmodus_enpoint.data == response_fcc_enpoint.data
	assert response_dotmodus_enpoint.status_code == response_fcc_enpoint.status_code


@pytest.mark.parametrize("attributedata,limit,offset", [
	("temperature", "10", "0"),
	("NO2,SO2", "17", "2"),
	("energy_consumed", "38", "20"),
	("b1_flow_value,b1_temp_out_value,b1_temp_back_value", "100", "10")
	])
def test_attributedata_limit_and_offset_params(test_client, attributedata, limit, offset):
	""" 
	Test whether the proposed /data endpoint functions the same as the 
	current one for the attributedata parameter together with the limit
	and offset parameters
	"""
	
	data = "attribute"
	param = "attributedata"

	response_fcc_enpoint = test_client.get(
		'/data?{}={}&limit={}&offset={}'.format(
			param,
			attributedata,
			limit,
			offset))
	response_dotmodus_enpoint = test_client.get(
		'/data/{}?{}={}&limit={}&offset={}'.format(
			data,
			param,
			attributedata,
			limit,
			offset))
	assert response_dotmodus_enpoint.data == response_fcc_enpoint.data
	assert response_dotmodus_enpoint.status_code == response_fcc_enpoint.status_code


@pytest.mark.parametrize("attributedata,operation,", [
	("temperature", "mean"),
	("NO2,SO2", "median"),
	("energy_consumed", "mean"),
	("b1_flow_value,b1_temp_out_value,b1_temp_back_value","sum")
	])
def test_attributedata_operation_params(test_client, attributedata,operation):
	""" 
	Test whether the proposed /data endpoint functions the same as the 
	current one for the attributedata parameter together with the operation
	parameter
	"""
	
	data = "attribute"
	param = "attributedata"

	response_fcc_enpoint = test_client.get(
		'/data?{}={}&operation={}'.format(
			param,
			attributedata,
			operation))
	response_dotmodus_enpoint = test_client.get(
		'/data/{}?{}={}&operation={}'.format(
			data,
			param,
			attributedata,
			operation))
	assert response_dotmodus_enpoint.data == response_fcc_enpoint.data
	assert response_dotmodus_enpoint.status_code == response_fcc_enpoint.status_code


@pytest.mark.parametrize("attributedata,grouped,", [
	("temperature", True),
	("NO2,SO2", True),
	("energy_consumed", True),
	("b1_flow_value,b1_temp_out_value,b1_temp_back_value", True)
	])

def test_attributedata_grouped_params(test_client, attributedata,grouped):
	""" 
	Test whether the proposed /data endpoint functions the same as the 
	current one for attributedata parameter together with the operation
	parameter
	"""
	
	data = "attribute"
	param = "attributedata"

	response_fcc_endpoint = test_client.get('/data?{}={}&grouped={}'.format(
		param,
		attributedata,
		grouped))
	response_dotmodus_endpoint = test_client.get(
		'/data/{}?{}={}&grouped={}'.format(
			data,
			param,
			attributedata,
			grouped))
	assert response_dotmodus_endpoint.data == response_fcc_endpoint.data
	assert response_dotmodus_endpoint.status_code == response_fcc_endpoint.status_code


@pytest.mark.parametrize("attributedata,harmonising_method,", [
							("NO2,SO2", "geo"),
							("free", "wide"),
							("b1_flow_value,b1_temp_out_value,b1_temp_back_value", "long")
						])
def test_attributedata_harmonising_method_params(
		test_client,
		attributedata,
		harmonising_method):
	""" 
	Test whether the proposed /data endpoint functions the same as the 
	current one for attributedata parameter together with the operation
	parameter
	"""
	
	data = "attribute"
	param = "attributedata"

	response_fcc_enpoint = test_client.get(
		'/data?{}={}&grouped=true&harmonising_method={}'.format(
			param,
			attributedata,
			harmonising_method))
	response_dotmodus_endpoint = test_client.get(
		'/data/{}?{}={}&grouped=true&harmonising_method={}'.format(
			data,
			param,
			attributedata,
			harmonising_method))
	assert response_dotmodus_endpoint.data == response_fcc_enpoint.data
	assert response_dotmodus_endpoint.status_code == response_fcc_enpoint.status_code
