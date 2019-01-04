from flask_restful import Resource, reqparse
import json

from models.request_analytics import RequestAnalytics
from models.operation import Operation
from models.request_tables import RequestTables
from models.request_table_cols import RequestTablesCols
from db import db
from utility import current_time, convert_to_date
from resources.initiate_task import InitiateTask
from resources.request_mapper import RequestMapper

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
                        type=str,
                        required=True,
                        choices=('True', 'False'),
                        help='Is the request to process timeseries data')

    parser.add_argument('missingValues',
                        type=str,
                        required=True,
                        choices=('remove', 'mean', 'median', 'backward fill', 'forward fill', 'default'),
                        help='Provide what needs to be done with missing values')

    parser.add_argument('dataRangeFrom',
                        type=str,
                        required=False, store_missing=False)

    parser.add_argument('dataRangeTo',
                        type=str,
                        required=False, store_missing=False)

    def post(self):
        data = str(self.parser.parse_args()).replace('"', '')
        data = data.replace("'", '"')
        jdata = None
        try:
            jdata = json.loads(data)
        except Exception:
            return {"Error": "Invalid json request"}, 400

        _request = RequestMapper(**jdata)

        if _request.dataRangeFrom and _request.dataRangeTo:

            valid_f, from_d = convert_to_date(_request.dataRangeFrom) 
            valid_t, to_d = convert_to_date(_request.dataRangeTo)

            if not valid_f or not valid_t:
                return {"error": "Invalid date format"}, 400
            
            if to_d < from_d:
                return {"error": "Invalid date format"}, 400

        request_id = self.create_request(_request.operation, _request.requestor_id, 
                                        bool(_request.timeseries), _request.missingValues, 
                                        _request.dataRangeFrom, _request.dataRangeTo)

        for table in _request.columnsX.tables:
            RequestTables(request_id, table.name).add_to_session()
            for column in table.columns:
                f_type = None
                f_value = None
                if column.filters:
                    for f in column.filters:
                        f_type = f.filters
                        f_value = ','.join(f.values)
                RequestTablesCols(request_id, table.name, column.name, 'X', f_type, f_value).add_to_session()

        is_present = False
        for table in _request.columnsX.tables:
            if table.name == _request.tableY:
                is_present = True
                break

        self.save_dependent_variable(request_id, _request.tableY, _request.columnY, is_present)
        self.save_request()
        
        return {
            'status': {
                'message': 'Request Accepted',
                'id': request_id,
                'user': _request.requestor_id,
                'timestamp': current_time()
            }
        }, 202

    def create_request(self, operation, requestor, timeseries, missing_values, data_range_from, data_range_to):
        operation_found = Operation.get_operation(operation)
        analytics = RequestAnalytics(user_id=requestor, 
                                    operation_id = operation_found.id, 
                                    timeseries = timeseries, 
                                    missing_values = missing_values, 
                                    data_range_from = data_range_from,
                                    data_range_to = data_range_to,
                                    status = 'Accepted')
        analytics.save()
        return analytics.id

    def save_dependent_variable(self, request_id, tableY, colY, is_present):
        if not is_present:
            RequestTables(request_id, tableY).add_to_session()
            
        RequestTablesCols(request_id, tableY, colY, 'Y').add_to_session()

    def save_request(self):
        db.session.commit()

class Dataset(object):
    def __init__(self, X, Y):
        self.X = X
        self.Y = Y
    
