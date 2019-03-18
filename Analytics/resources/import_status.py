from flask_restful import Resource, reqparse, inputs
from db import db

from models.importer_status import ImporterStatuses


class ImportStatus(Resource):
    """
    API endpoint, return the status of importers and their is a failure,
    return the reasons for the failure
    """
    
    def get(self) -> (str, int):

        statuses = ImporterStatuses.get_all()
        if statuses:
            status_list = []
            for status in statuses:
                status_list.append(status.json())

            return status_list, 200
        else:
            return [], 404
