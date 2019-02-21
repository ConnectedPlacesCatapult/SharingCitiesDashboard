import json

from flask_restful import Resource
from flask_restful import abort
from flask_restful import reqparse
from models.widget import WidgetModel


class SaveWidgetLayout(Resource):

    def __init__(self):

        self.post_reqparser = reqparse.RequestParser()
        self.post_reqparser.add_argument('layouts', action='append')

        super().__init__()

    def post(self):
        widgets_not_found = []
        args = self.post_reqparser.parse_args()

        print(args)

        for layout in args['layouts']:
            layout = layout.replace("'", "\"")

            layout_json = json.loads(layout)

            widget = WidgetModel.get_widget_by_id(int(layout_json["id"]))
            if not widget:
                widgets_not_found.append(layout_json["id"])
            else:
                widget.layout.widget_id = int(layout_json['id'])
                widget.layout.x_coord = layout_json['x']
                widget.layout.y_coord = layout_json['y']
                widget.layout.height = layout_json['h']
                widget.layout.width = layout_json['w']
                widget.layout.static = bool(layout_json['static'])

                widget.save()
                widget.commit()

            if len(widgets_not_found) >= 1:
                abort(404, error="Widgets not found", widget_ids=json.dumps(widgets_not_found))

        return "", 204
