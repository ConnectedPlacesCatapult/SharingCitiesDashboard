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

    def create_request(self, operation_name, req_id):
        return self.app.post('/analytics', 
                            data=json.dumps(
                                dict(columnsX= dict(
                                    table1= ['col1', 'col2', 'col3'],
                                    table2= ['col4', 'col5', 'col6']
                                ),
                                columnY= 'yCol',
                                tableY= 'table2',
                                operation= operation_name,
                                requestor_id= req_id)), 
                                content_type='application/json')

    def create_request_missing_attribute(self):
        # a mandatory attribute tableY is missing while creating this request
        return self.app.post('/analytics', 
                            data=json.dumps(
                                dict(columnsX= dict(
                                    table1= ['col1', 'col2', 'col3'],
                                    table2= ['col4', 'col5', 'col6']
                                ),
                                columnY= 'yCol',
                                operation= 'classification',
                                requestor_id= 456)), 
                                content_type='application/json')

    def test_request(self):
        response = self.create_request('classification', 456)
        
        self.assertEqual(response.get_json(), {'status': {
                                            'message': 'Request Accepted', 
                                            'id': 1, 'user': 456, 
                                            'timestamp': current_time()
                                            }})

    def test_invalid_operation(self):
        response = self.create_request('invalid', 456)
        
        self.assertEqual(response.get_json(), {'message': {
                                            'operation': 'Please specify a valid operation'
                                            }})

    def test_invalid_data_type(self):
        response = self.create_request('classification', 'john')
        
        self.assertEqual(response.get_json(), {'message': {
                                                'requestor_id': 'Requestor Id is mandatory'
                                                }})

    def test_missing_attribute(self):
        response = self.create_request_missing_attribute()
        
        self.assertEqual(response.get_json(), {'message': {
                                                'tableY': 'Target table name is mandatory'
                                                }})
        