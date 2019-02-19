from http import HTTPStatus

from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource
from flask_restful import abort, inputs
from flask_restful import reqparse
from sqlalchemy import exc

from db import db
from models.layout_model import Layouts
from models.widget import WidgetModel



class CreateWidgetLayout(Resource):

    def __init__(self):

        self.post_reqparser = reqparse.RequestParser()
        self.post_reqparser.add_argument("widgetID",  help='widgetID required', location=['form', 'json'])
        self.post_reqparser.add_argument("x", help='Widget layout: x coordinate found', location=['form', 'json'])
        self.post_reqparser.add_argument("y", help='Widget layout: y coordinate found', location=['form', 'json'])
        self.post_reqparser.add_argument("h", help='Widget layout: height found', location=['form', 'json'])
        self.post_reqparser.add_argument("w", help='Widget layout: width found', location=['form', 'json'])
        self.post_reqparser.add_argument("static", default=False, help='Widget layout: error passing static variable', location=['form', 'json'])

        super().__init__()

    def post(self):

        args = self.post_reqparser.parse_args()
        widget = WidgetModel.get_widget_by_id(args["widgetID"])
        print(widget.layout.json())
        if not widget.layout:
            abort(HTTPStatus.FAILED_DEPENDENCY, error="layout object is None")

        #create layout
        widget.layout.widgetID = int(args["widgetID"])
        widget.layout.x_coord = args["x"]
        widget.layout.y_coord = args["y"]
        widget.layout.height = args["h"]
        widget.layout.width = args["w"]
        widget.layout.static = args["static"]


        widget.save()
        widget.commit()

        return "Wiget {}  layout saved".format(widget.id), 201






