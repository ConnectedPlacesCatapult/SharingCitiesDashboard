from flask_restful import Resource, reqparse, inputs
from flask_jwt_extended import jwt_required, get_jwt_claims
from db import db
from models.importer_status import ImporterStatuses


class ImportStatus(Resource):
    """
    API endpoint, return the status of importers and if their state is
    failure, return the reasons for the failure
    """

    @jwt_required
    def get(self) -> (str, int):

        if get_jwt_claims()["admin"]:
            statuses = ImporterStatuses.get_all()
            if statuses:
                status_list = []
                for status in statuses:
                    status_list.append(status.json())

                return status_list, 200
            else:
                return {"message": "No statuses available"}, 404
        else:
            return {"message": "Not Authorised"}, 403
