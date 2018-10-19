import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import unittest
import json
from test_setup_teardown import SetupTearDown
from utility import current_time

class AnalyticsTest(unittest.TestCase):
    def setUp(self):
        self.application = SetupTearDown()
        self.app = self.application.setUp()

    def tearDown(self):
        self.application.tearDown()

    def create_request(self, operation_name='classification', req_id=456, 
                        data_range_from='12-03-2018 00:00:00', 
                        data_range_to='12-03-2018 00:00:00'):
        d = dict(columnsX= dict(
                                table1= dict(
                                    col1 = dict(
                                        _and= ['no2', 'so2']
                                    ),
                                    col2= 'None',
                                    col3= 'None'
                                ),
                                table2= dict(
                                    col4= 'None',
                                    col5= 'None',
                                    col6= 'None'
                                )
                            ),
                            columnY= 'yCol',
                            tableY= 'table2',
                            operation= operation_name,
                            requestor_id= req_id,
                            timeseries='True',
                            missingValues='remove',
                            dataRangeFrom=data_range_from,
                            dataRangeTo=data_range_to)
        return self.app.post('/analytics', data=json.dumps(d), 
                            content_type='application/json')

    def create_request_missing_attribute(self, attribute_name):
        # a mandatory attribute tableY is missing while creating this request
        d = dict(columnsX= dict(
                                table1= dict(
                                    col1 = dict(
                                        _and= ['no2', 'so2']
                                    ),
                                    col2= 'None',
                                    col3= 'None'
                                ),
                                table2= dict(
                                    col4= 'None',
                                    col5= 'None',
                                    col6= 'None'
                                )
                            ),
                            columnY= 'yCol',
                            tableY= 'table2',
                            operation= 'classification',
                            requestor_id= 456,
                            timeseries= 'True',
                            missingValues= 'remove')
        d.pop(attribute_name)
        return self.app.post('/analytics', data=json.dumps(d), content_type='application/json')

    def create_request_change_attribute_value(self, attribute_name, value):
        d = dict(columnsX= dict(
                                table1= dict(
                                    col1 = dict(
                                        _and= ['no2', 'so2']
                                    ),
                                    col2= 'None',
                                    col3= 'None'
                                ),
                                table2= dict(
                                    col4= 'None',
                                    col5= 'None',
                                    col6= 'None'
                                )
                            ),
                            columnY= 'yCol',
                            tableY= 'table2',
                            operation= 'classification',
                            requestor_id= 456,
                            timeseries= 'True',
                            missingValues= 'remove')
        d[attribute_name] = value
        return self.app.post('/analytics', data=json.dumps(d), content_type='application/json')

    def test_request(self):
        response = self.create_request()
        
        self.assertEqual(response.get_json(), {'status': {
                                            'message': 'Request Accepted', 
                                            'id': 1, 'user': 456, 
                                            'timestamp': current_time()
                                            }})

    def test_invalid_operation(self):
        response = self.create_request(operation_name='invalid')
        
        self.assertEqual(response.get_json(), {'message': {
                                            'operation': 'Please specify a valid operation'
                                            }})

    def test_invalid_data_type(self):
        response = self.create_request(req_id='john')
        
        self.assertEqual(response.get_json(), {'message': {
                                                'requestor_id': 'Requestor Id is mandatory'
                                                }})

    def test_missing_attribute(self):
        response = self.create_request_missing_attribute('tableY')
        
        self.assertEqual(response.get_json(), {'message': {
                                                'tableY': 'Target table name is mandatory'
                                                }})

    def test_missing_timeseries(self):
        response = self.create_request_missing_attribute('timeseries')

        self.assertEqual(response.get_json(), { "message": {
                                                "timeseries": "Is the request to process timeseries data"
                                                }})

    def test_missing_missingValues(self):
        response = self.create_request_missing_attribute('missingValues')

        self.assertEqual(response.get_json(), { "message": {
                                                "missingValues": "Provide what needs to be done with missing values"
                                                }})

    def test_incorrect_missing_value(self):
        response = self.create_request_change_attribute_value('missingValues', 'test')

        self.assertEqual(response.get_json(), { "message": {
                                                "missingValues": "Provide what needs to be done with missing values"
                                                }})

    def test_data_range_invalid(self):
        response = self.create_request(data_range_from='test', data_range_to='test')
        self.assertEqual(response.get_json(), {"error": "Invalid date format"})

        response_1 = self.create_request(data_range_to='test')
        self.assertEqual(response_1.get_json(), {"error": "Invalid date format"})

        response_2 = self.create_request(data_range_from='12-03-2018 00:00:00',
                                        data_range_to='11-03-2018 00:00:00')
        self.assertEqual(response_2.get_json(), {"error": "Invalid date format"})





        