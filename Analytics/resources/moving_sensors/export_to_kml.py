from http import HTTPStatus

import simplekml
from flask_restful import Resource
from flask_restful import reqparse

from models.pin_location_data import Tracker


class ExportToKML(Resource):
    """
    Fetch Theme Tree Themes
    """

    def __init__(self) -> None:
        """
        Set required arguments for POST request
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('tracker_id', required=True, type=str)
        self.reqparser.add_argument('start_date', required=False, store_missing=False, type=str)
        self.reqparser.add_argument('end_date', required=False, store_missing=False, type=str)

    def get(self):
        args = self.reqparser.parse_args()
        kml = simplekml.Kml()
        tracker = Tracker.get_by_tracker_id(args["tracker_id"])
        if not tracker:
            return {"error": "tracker with id {} not found".format(args["tracker_id"])}, HTTPStatus.NOT_FOUND

        path = kml.newlinestring(name="{}".format(tracker.id), description="",
                                 coords=tracker.kml_coords)

        path.style.linestyle.color = 'AA66CCff'  # Red
        path.style.linestyle.width = 3  # 10 pixels

        kml.save('{}.kml'.format(tracker.id))
        # path.savekmz('{}.kmz'.format(tracker.id))
        return "done", 200

        # TODO: Finish implementation
        print(tracker.json)
        return tracker.json, 200
