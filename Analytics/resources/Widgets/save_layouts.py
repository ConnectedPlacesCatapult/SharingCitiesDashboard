import json

from flask_restful import Resource
from flask_restful import abort
from flask_restful import reqparse

from models.widget import WidgetModel


class SaveWidgetLayout(Resource):
    """
    Persists widget layout to the database
    Parameters can be passed using a POST request that contains a JSON with the following fields:
    :param layouts: layouts to be saved
    :type layouts: str
    :param id: Related widget identification number
    :type id:   str
    :param x: x coordinate of widget
    :type x:   int
    :param y: y coordinate of widget
    :type y:   int
    :param h: height of widget
    :type h:   int
    :param w: width of widget
    :type w:   int
    :param static: static state
    :type static:   str

    :return: On success a HTTP status code 200, executed successfully with no content is return
             otherwise, a HTTP status code 404, not found with content containing JSON objects
    """

    def __init__(self) -> None:
        # Arguments passer to save layouts appends values sent in post to a list
        self.post_reqparser = reqparse.RequestParser()
        self.post_reqparser.add_argument('layouts', action='append')
        super().__init__()

    def post(self) -> (str, int):
        """
        Pesists widget layout to the database
        Parameters can be passed using a POST request that contains a JSON with the following fields:
        :param layouts: layouts to be saved
        :type layouts: str
        :param id: Related widget identification number
        :type id:   str
        :param x: x coordinate of widget
        :type x:   int
        :param y: y coordinate of widget
        :type y:   int
        :param h: height of widget
        :type h:   int
        :param w: width of widget
        :type w:   int
        :param static: static state
        :type static:   str

        :return: On success a HTTP status code 200, executed successfully with no content is return
                 otherwise, a HTTP status code 404, not found with content containing JSON objects
        """
        # Keep track of widgetIDs that are not found to inform user
        widgets_not_found = []
        # Keep track of widgetIDs that are updated to inform user
        widgets_updated = []
        # Get layout data passed in post request
        args = self.post_reqparser.parse_args()

        # Cycle throught the layout/s recieved in post request (there may be multiple layouts)
        for layout in args['layouts']:
            # Sanitize the layout data to be loaded into JSON ( eg. replace single quote with double quotes)
            layout = layout.replace("'", "\"")
            # Change sanitized layout data into json format
            layout_json = json.loads(layout)
            # Fetch the widget instance
            widget = WidgetModel.get_widget_by_id(int(layout_json["id"]))
            # does the widget exist?
            if not widget:
                # widget with the widgetID received does not exist so log it for the response
                widgets_not_found.append(layout_json["id"])
            else:
                # Got a widget. Update its layout
                widget.layout.widget_id = int(layout_json['id'])
                widget.layout.x_coord = layout_json['x']
                widget.layout.y_coord = layout_json['y']
                widget.layout.height = layout_json['h']
                widget.layout.width = layout_json['w']
                widget.layout.static = bool(layout_json['static'])
                widgets_updated.append(int(layout_json["id"]))
                # Save changes to the widget
                widget.save()
                widget.commit()

        # Where all widget layouts updated?
        if len(widgets_not_found) >= 1:
            abort(404, error="Widgets not found", widgets_not_found=len(widgets_not_found),
                  widget_ids=json.dumps(widgets_not_found), widgets_updated=json.dumps(widgets_updated))

        return "", 200
