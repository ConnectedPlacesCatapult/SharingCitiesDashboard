import json
from datetime import datetime

class RequestMapper(object):
    def __init__(self, columnsX, columnY, tableY, operation, 
                requestor_id, timeseries, missingValues, 
                dataRangeFrom = None, 
                dataRangeTo = None):
        self.columnsX = ColumnsX(**columnsX)
        self.columnY = columnY
        self.tableY = tableY
        self.operation = operation
        self.requestor_id = requestor_id
        self.timeseries = timeseries
        self.missingValues = missingValues
        self.dataRangeFrom = dataRangeFrom
        self.dataRangeTo = dataRangeTo

    def __str__(self):
        return json.dumps(self, indent=2, default=lambda a: a.__dict__)

class ColumnsX(object):
    def __init__(self, **kwargs):
        self.tables = []
        for key in kwargs:
            self.tables.append(Tables(key, dict(kwargs[key])))

    def __str__(self):
        return json.dumps(self, indent=2, default=lambda a: a.__dict__)

class Tables(object):
    def __init__(self, name, kwargs):
        self.name = name
        self.columns = []
        for key in kwargs:
            if kwargs[key] != 'None':
                self.columns.append(Columns(key, dict(kwargs[key])))
            else:
                self.columns.append(Columns(key))

    def __str__(self):
        return json.dumps(self, indent=2, default=lambda a: a.__dict__)

class Columns(object):
    def __init__(self, name, kwargs=None):
        self.name = name
        self.filters = []
        if kwargs is not None:            
            for key in kwargs:
                self.filters.append(Filters(key, kwargs[key]))

    def __str__(self):
        return json.dumps(self, indent=2, default=lambda a: a.__dict__)

class Filters(object):
    def __init__(self, filters, values):
        self.filters = filters
        self.values = values

    def __str__(self):
        return json.dumps(self, indent=2, default=lambda a: a.__dict__)


