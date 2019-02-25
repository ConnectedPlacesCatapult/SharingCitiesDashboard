from http import HTTPStatus

from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import abort
from flask_restful import reqparse

from models.widget import WidgetModel


class GetLayouts(Resource):
    """
    Fetches all layouts for the widgets with a specific userID
    :param  userID: Unique user identification number
    :param  limit:  maximum count of widgets to be returned (optional)
    :type userID: int
    :type limit: int
    """

    def __init__(self) -> None:
        """
        Fetches all layouts for the widgets with a specific userID
        :param  userID: Unique user identification number
        :param  limit:  maximum count of widgets to be returned (optional)
        :type userID: int
        :type limit: int
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('userID', required=True, help='A userID is required',
                                    location=['form', 'json'])
        self.reqparser.add_argument('limit', required=False, default=10, help='A userID is required',
                                    location=['form', 'json'])
        super().__init__()

    @jwt_required
    def post(self) -> ([str], int):
        """
        Fetches all layouts for the widgets with a specific userID

        :param  userID: Unique user identification number
        :param  limit:  maximum count of widgets to be returned (optional)

        :type userID: int
        :type limit: int

        :returns: on success a list of all the widget layouts related to the userID are returned. If no
                  widget are found for the userID a HTTP status code 404, Not Found is returned with an
                  error message "no widgets found".
        """
        # Fetch the userID from post content ( limit is optional )
        args = self.reqparser.parse_args()
        # Fetch the instances of the widgets to assign the new layouts
        widgets = WidgetModel.query.filter_by(user_id=args["userID"]).limit(args["limit"]).all()

        # Where widgets returned
        if not widgets:
            # no widgets related to the userID supplied
            abort(HTTPStatus.NOT_FOUND.value, error="no widgets found")

        # Store layout instances to be returned
        layout_list = []

        # Get all layout instances for the widgets
        for widget in widgets:
            widget = WidgetModel.get_widget_by_id(widget.id)
            widget.layout.widgetID = widget.id
            # Format layouts to be return
            layout_list.append(widget.layout.json())

        return layout_list, HTTPStatus.OK.value
