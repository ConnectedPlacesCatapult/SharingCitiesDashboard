from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from flask_restful import reqparse
from http import HTTPStatus

from models.alert_model import AlertWidgetModel
from models.users import Users
from models.attribute_range import AttributeRange
from models.attributes import Attributes


class CheckAlerts(Resource):

    def __init__(self) -> None:
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('user_id', required=False, type=int,
                                    store_missing=False)
        self.reqparser.add_argument('attribute_id', required=True, type=str,
                                    help='Attribute Id missing')


    @jwt_required
    def get(self):
        args = self.reqparser.parse_args()

        # Use current user_id if not user_id was parsed
        if "user_id" not in args:
            user = Users.find_by_email(get_jwt_identity())
            if user:
                args["user_id"] = user.id
            else:
                # Return Error current user id not found
                return (dict(error="User id not found for Current user, "
                                   "User session may have timed out"),
                        HTTPStatus.INTERNAL_SERVER_ERROR)
        else:
            if not Users.find_by_id(args["user_id"]):
                # Return error Parsed User Id not found
                return dict(error="User with id {} not found.".format(
                    args["user_id"])), HTTPStatus.NOT_FOUND

        # Check Attribute exists
        if not Attributes.get_by_id(args["attribute_id"]):
            # Return Error Attribute ID not found
            return dict(error="Attribute id {} not found.".format(
                args["attribute_id"])), HTTPStatus.NOT_FOUND

        # Get Attribute Max and Minimums
        attribute_range = AttributeRange.get_by_attr_id(args["attribute_id"])

        if not attribute_range:
            # Return eroor Attribute range not found
            return (dict(error="Attribute range not found", **args),
                    HTTPStatus.NOT_FOUND)

        # Check Alerts
        max_alerts = AlertWidgetModel.get_max_alerts(attribute_range)
        min_alerts = AlertWidgetModel.get_min_alerts(attribute_range)

        return dict(max=max_alerts, min=min_alerts), 200





