from flask_restful import Resource, reqparse
import json

from models.request_analytics import RequestAnalytics
from models.operation import Operation
from models.request_tables import RequestTables
from models.request_table_cols import RequestTablesCols
from db import db
from utility import current_time, convert_to_date

class Analytics(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('columnsX',
                        action=dict,
                        required=True,
                        help='Column names are mandatory')

    parser.add_argument('columnY',
                        type=str,
                        required=True,
                        help='Target Column is mandatory')
    
    parser.add_argument('tableY',
                        type=str,
                        required=True,
                        help='Target table name is mandatory')

    parser.add_argument('operation',
                        required=True,
                        choices=('regression', 'clustering', 'classification'),
                        help='Please specify a valid operation')

    parser.add_argument('requestor_id',
                        type=int,
                        required=True,
                        help='Requestor Id is mandatory')

    parser.add_argument('timeseries',
                        type=bool,
                        required=True,
                        help='Is the request to process timeseries data')

    parser.add_argument('missingValues',
                        type=str,
                        required=True,
                        choices=('remove', 'mean', 'median', 'backward fill', 'forward fill', 'default'),
                        help='Provide what needs to be done with missing values')

    parser.add_argument('dataRange',
                        type=str,
                        required=False)

    def post(self):
        data = self.parser.parse_args()
        operation = data['operation']
        requestor = data['requestor_id']
        timeseries = data['timeseries']
        missing_values = data['missingValues']
        data_range = None

        if data['dataRange']:
            if '.' not in data['dataRange']:
                return {"error": "Invalid date format"}, 400
            
            date = data['dataRange'].split('.')

            valid_f, from_d = convert_to_date(date[0]) 
            valid_t, to_d = convert_to_date(date[1])

            if not valid_f or not valid_t:
                return {"error": "Invalid date format"}, 400

            data_range = data['dataRange']

        request_id = self.create_request(operation, requestor, timeseries, 
                                            missing_values, data_range)

        j = json.loads(data['columnsX'].replace("'", '"'))
        if not j:
            return {"error": "Column names not valid"}, 400

        for key in j:
            RequestTables(request_id, key).add_to_session()
            for value in j[key]:
                RequestTablesCols(request_id, key, value, 'X').add_to_session()

        is_present = False
        if data['tableY'] in j:
            is_present = True
        self.save_dependent_variable(request_id, data['tableY'], data['columnY'], is_present)
        self.save_request()
        
        return {
            'status': {
                'message': 'Request Accepted',
                'id': request_id,
                'user': requestor,
                'timestamp': current_time()
            }
        }, 202

    def create_request(self, operation, requestor, timeseries, missing_values, data_range):
        operation_found = Operation.get_operation(operation)
        analytics = RequestAnalytics(user_id=requestor, 
                                    operation_id = operation_found.id, 
                                    timeseries = timeseries, 
                                    missing_values = missing_values, 
                                    data_range = data_range,
                                    status = 'Accepted')
        analytics.save()
        return analytics.id

    def save_dependent_variable(self, request_id, tableY, colY, is_present):
        if not is_present:
            RequestTables(request_id, tableY).add_to_session()
            
        RequestTablesCols(request_id, tableY, colY, 'Y').add_to_session()

    def save_request(self):
        db.session.commit()
    
