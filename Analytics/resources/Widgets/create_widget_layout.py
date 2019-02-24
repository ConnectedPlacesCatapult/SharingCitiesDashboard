import logging
from http import HTTPStatus

from flask_restful import Resource
from flask_restful import abort
from flask_restful import reqparse

from models.widget import WidgetModel

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class CreateWidgetLayout(Resource):
    """
    Creates a Widget layout to the database table 'layouts'
    Parameters can be passed using a POST request that contains a JSON with the following fields:
    :param widgetID: The widget identification the layout belongs to
    :param x: x coordinate of the widget layout
    :param y: y coordinate of the widget layout
    :param h: height of the widget layout
    :param w: width of the widget layout
    :param static: layout static property

    :type widgetID: str
    :type x: int
    :type y: int
    :type h: int
    :type w: int
    :type static: str

    :returns:  on success a HTTP status code 200, otherwiseif the layout instance is not found a HTTP status
        code 404, Not Found with json with a key "error" containing a message "layout object not found"
    """

    def __init__(self):
        """
        Instantiates the create widget endpoint
        Parameters can be passed using a POST request that contains a JSON with the following fields:
        :param widgetID: The widget identification the layout belongs to
        :param x: x coordinate of the widget layout
        :param y: y coordinate of the widget layout
        :param h: height of the widget layout
        :param w: width of the widget layout
        :param static: layout static property

        :type widgetID: str
        :type x: int
        :type y: int
        :type h: int
        :type w: int
        :type static: str
        """
        # Argument required to create a widget layout
        self.post_reqparser = reqparse.RequestParser()
        self.post_reqparser.add_argument("widgetID", help='widgetID required', location=['form', 'json'])
        self.post_reqparser.add_argument("x", help='Widget layout: x coordinate found', location=['form', 'json'])
        self.post_reqparser.add_argument("y", help='Widget layout: y coordinate found', location=['form', 'json'])
        self.post_reqparser.add_argument("h", help='Widget layout: height found', location=['form', 'json'])
        self.post_reqparser.add_argument("w", help='Widget layout: width found', location=['form', 'json'])
        self.post_reqparser.add_argument("static", default=False, help='Widget layout: error passing static variable',
                                         location=['form', 'json'])
        super().__init__()

    def post(self) -> (str, int):
        """
        Creates a Widget layout to the database table 'layouts'
        Parameters can be passed using a POST request that contains a JSON with the following fields:
        :param widgetID: The widget identification the layout belongs to
        :param x: x coordinate of the widget layout
        :param y: y coordinate of the widget layout
        :param h: height of the widget layout
        :param w: width of the widget layout
        :param static: layout static property

        :type widgetID: str
        :type x: int
        :type y: int
        :type h: int
        :type w: int
        :type static: str

        :returns:  on success a HTTP status code 200, otherwiseif the layout instance is not found a HTTP status
        code 404, Not Found with json with a key "error" containing a message "layout object not found"
        """
        # Fetch layout values from post content
        args = self.post_reqparser.parse_args()
        # Fetch the instance of the widget to assign new layout
        widget = WidgetModel.get_widget_by_id(args["widgetID"])

        # does the widget with the passed widgetID exist?
        if not widget.layout:
            # No widget return with the passed widgetID
            logging.debug("CreateWidgetLayout(): ", status_code=HTTPStatus.NOT_FOUND.value,
                          error="layout object not found")
            abort(HTTPStatus.NOT_FOUND.value, error="layout object not found")

        # Modify layout instance for widget
        widget.layout.widgetID = int(args["widgetID"])
        widget.layout.x_coord = args["x"]
        widget.layout.y_coord = args["y"]
        widget.layout.height = args["h"]
        widget.layout.width = args["w"]
        widget.layout.static = args["static"]

        # Commit changes to the database
        widget.save()
        widget.commit()

        return "Widget crearted", 200
