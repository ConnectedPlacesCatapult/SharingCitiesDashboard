import datetime
import importlib
import logging

from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_claims

from db import db
from importers.state_decorator import ImporterStatus
from models.importer_status import ImporterStatuses
from models.api import API

logging.basicConfig(level='INFO', filename='importers.log', filemode='a')
logger = logging.getLogger(__name__)


class ImportRetry(Resource):
    """
    API endpoint, rerun an importer that has failed.
    """

    status_tracker = ImporterStatus.get_importer_status()
    parser = reqparse.RequestParser()
    parser.add_argument("api_id")

    @status_tracker.changed.register
    def status_has_changed(self, status: ImporterStatus):
        """
        Receive the status of an importer and persist it to the Importer
        Status table
        :param status: Status object defining the state of an importer
        """
        logger.info(status)
        importer_status = ImporterStatuses.find_by_name(status.name)
        if importer_status:
            if status.state == "success":
                importer_status.state = "success"
            else:
                importer_status.state = "failure"
                importer_status.reason = status.reason
                importer_status.trace = status.stack_trace

            importer_status.timestamp = datetime.datetime.now()
            importer_status.commit()

    @jwt_required
    def post(self) -> (dict, int):
        """
        POST request, allow an admin user to run the importer which
        corresponds to the api_id argument
        :return: A message that indicates whether or not the importer was
                 executed
        """
        args = self.parser.parse_args()
        if get_jwt_claims()["admin"]:
            if self.retry_importer(args["api_id"]):
                return {"message": "success"}, 200
            else:
                return {"message": "importer could not be found"}, 200
        else:
            return {"message": "Not Authorised"}, 403

    @staticmethod
    def retry_importer(api_id) -> bool:
        """
        Execute the importer that corresponds to the api_id arguments
        :param api_id: id of an entry in the api table
        :return: whether the was importer executed
        """
        api_entry = API.get_by_api_id(api_id)
        if api_entry:
            _module, _class = api_entry.api_class.rsplit('.', 1)
            data_class = getattr(importlib.import_module(_module), _class)
            _d_class = data_class()
            _d_class._create_datasource()

            return True
        else:
            return False
