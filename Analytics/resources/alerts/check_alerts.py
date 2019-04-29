from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from flask_restful import reqparse

from models.alert_model import AlertWidgetModel
from models.attribute_range import AttributeRange
from models.attributes import Attributes
from models.users import Users


class CheckAlerts(Resource):
    """
    Check For Widget Alerts that have been triggered. Using a Get request with
    the following GET params:
    * user_id: User Id, If the User Id is not parsed the current User Id  is used
    * attribute_id: Attribute Id

    """

    def __init__(self) -> None:
        """ Instantiate Reqpase """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('user_id', required=False, type=int,
                                    store_missing=False)
        self.reqparser.add_argument('attribute_id', required=True, type=str,
                                    help='Attribute Id missing')

    @jwt_required
    def get(self) -> (dict, HTTPStatus):
        """
        Check for triggered Alerts
        :return: On Success, An HTTP Response with a JSON body content
        containing the Maximum and Minimum Alerts that have been  exceeded with
        an HTTPStatus code of 200 (OK), otherwise An HTTP Response with a JSON
        body content containing an appropriate error message and appropriate an
        HTTP status code
        """
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
            user = Users.find_by_id(args["user_id"])
            if not user:
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
        max_alerts = AlertWidgetModel.get_max_alerts(attribute_range,
                                                     user_id=user.id)
        min_alerts = AlertWidgetModel.get_min_alerts(attribute_range,
                                                     user_id=user.id)

        return dict(max=max_alerts, min=min_alerts), 200
