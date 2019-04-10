from http import HTTPStatus

import simplekml
from flask_restful import Resource
from flask_restful import reqparse

from models.pin_location_data import Tracker


class ExportToKML(Resource):
    """
    Export Location Data to KML
    """

    def __init__(self) -> None:
        """
        Set required arguments for GET request
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('tracker_id', required=True, type=str)
        self.reqparser.add_argument('start_date', required=False,
                                    store_missing=False, type=str)
        self.reqparser.add_argument('end_date', required=False,
                                    store_missing=False, type=str)

    def get(self) -> ({str: str}, HTTPStatus):
        """
        Export Location data for Tracker to KML file
        :param tracker_id: Tracker Id
        :param start_date: Creation date of new data to export
        :param end_date: Creation date of the oldest data to export
        :return: JSON containing the filename and an HTTPStatus of 204(created)
            otherwise an JSON error response with the appropriate HTTPStatus
        """
        args = self.reqparser.parse_args()
        kml = simplekml.Kml()
        tracker = Tracker.get_by_tracker_id(args["tracker_id"])
        if not tracker:
            return {"error": "tracker with id {} not found".format(
                args["tracker_id"])}, HTTPStatus.NOT_FOUND

        path = kml.newlinestring(name="{}".format(tracker.id), description="",
                                 coords=tracker.kml_coords)

        path.style.linestyle.color = 'AA66CCff'  # Red
        path.style.linestyle.width = 3  # 10 pixels

        try:
            kml.save('{}.kml'.format(tracker.id))
        except IOError as ioe:
            return dict(error="Unable to create KML file",
                        traceback=ioe.with_traceback(ioe.__traceback__)), \
                   HTTPStatus.INTERNAL_SERVER_ERROR

        return dict(file_name=args["tracker_id"] + ".kml"), HTTPStatus.CREATED
