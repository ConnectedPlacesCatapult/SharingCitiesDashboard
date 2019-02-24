from http import HTTPStatus

from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import abort
from flask_restful import reqparse

from models.widget import WidgetModel


class GetWidgetLayout(Resource):
    """
        Fetches layout for widget with the passed widgetID
        Parameters can be passed using a POST request that contains a JSON with the following fields:
        :param  widgetID: Unique widget identification number
        :type widgetID:   int

        :returns:   on success the widgets layout instance is return if the widget or layout
                    is not found a HTTP status code 404, Not Found is returned with a error discription
    """

    def __init__(self):
        """
        Instantiates the get widget endpoint
        Fetches layout for widget with the passed widgetID
        Parameters can be passed using a POST request that contains a JSON with the following fields:
        :param  widgetID: Unique widget identification number
        :type widgetID:   int
        """
        # Arguments required to fetch the layout the widget related to the userID
        self.reqparser_get = reqparse.RequestParser()
        self.reqparser_get.add_argument('widgetID', required=True, help='A widgetID is required',
                                        location=['form', 'json'])
        super().__init__()

    @jwt_required
    def post(self) -> (str, int):
        """
        Fetches layout for widget with the passed widgetID
        Parameters can be passed using a POST request that contains a JSON with the following fields:
        :param  widgetID: Unique widget identification number
        :type widgetID:   int

        :returns:   on success the widgets layout instance is return if the widget or layout
                    is not found a HTTP status code 404, Not Found is returned with a error discription
        """
        args = self.reqparser_get.parse_args()
        # Fetch the instances of the widget to get the related layout.
        widget = WidgetModel.query.filter_by(id=args["widgetID"]).first()

        # does the widget exist?
        if not widget:
            # Widget instance not found
            abort(HTTPStatus.NOT_FOUND.value, error="no widget found with widgetID: {}".format(args["widgetID"]))
        if not widget.layout:
            # Widget instance found but no layout instance is present
            abort(HTTPStatus.NOT_FOUND.value, error="no widget layout found for widgetID: {}".format(args["widgetID"]))

        return widget.layout.json(), HTTPStatus.OK.value
