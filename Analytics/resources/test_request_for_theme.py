import pytest
from app import create_app
from db import db

@pytest.fixture()
def test_client():
	test_app = create_app(DATABASE_NAME='fcc_dump', TESTING=True)
	testing_client = test_app.test_client()

	test_app_context = test_app.app_context()
	test_app_context.push()

	yield testing_client

	test_app_context.pop()

def test_theme_no_params(test_client):
	data = "theme"
	param = ""
	param_value = ""

	response_fcc_enpoint = test_client.get('/data?{}={}'.format(param,param_value))

	response_dotmodus_enpoint = test_client.get('/data/{}?{}={}'.format(data,param,param_value))
	assert response_dotmodus_enpoint.data == response_fcc_enpoint.data
	assert response_dotmodus_enpoint.status_code == response_fcc_enpoint.status_code

@pytest.mark.parametrize("theme_param_value", [1,2,3])
def test_theme_with_params(test_client, theme_param_value):
	data = "theme"
	param = "theme"

	response_fcc_enpoint = test_client.get('/data?{}={}'.format(param,theme_param_value))
	response_dotmodus_enpoint = test_client.get('/data/{}?{}={}'.format(data,param,theme_param_value))
	assert response_dotmodus_enpoint.data == response_fcc_enpoint.data
	assert response_dotmodus_enpoint.status_code == response_fcc_enpoint.status_code

@pytest.mark.parametrize("subtheme_param_value", [1,2,3,4])
def test_subtheme_params(test_client, subtheme_param_value):
	data = "theme"
	param = "subtheme"

	response_fcc_enpoint = test_client.get('/data?{}={}'.format(param,subtheme_param_value))
	response_dotmodus_enpoint = test_client.get('/data/{}?{}={}'.format(data,param,subtheme_param_value))
	assert response_dotmodus_enpoint.data == response_fcc_enpoint.data
	assert response_dotmodus_enpoint.status_code == response_fcc_enpoint.status_code







