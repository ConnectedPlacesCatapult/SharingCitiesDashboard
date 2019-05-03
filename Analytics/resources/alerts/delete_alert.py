from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from flask_restful import reqparse

from models.alert_model import AlertWidgetModel
from models.users import Users


class DeleteAlerts(Resource):
    """
    Delete an alert.
    Use a POST request to delete an alert. The following parameters can be
    parsed as a JSON body content:
        * id: Alert Id.
        * user_id: User Id.
        * attribute_Id: Attribute Id.
    All parameters are optional but at least one of the above parameters are
    required.
    """

    def __init__(self) -> None:
        """
        Instantiate reqpare for POST request.
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('id', required=False, type=int,
                                    store_missing=False)
        self.reqparser.add_argument('user_id', required=False, type=int,
                                    store_missing=False)
        self.reqparser.add_argument('attribute_id', required=False, type=str,
                                    store_missing=False)

    @jwt_required
    def post(self) -> (dict, HTTPStatus):
        """
        Delete an alert.
        :return: On success, A HTTP response with a a JSON body content
                 containing  a message, a list of deleted alerts and an HTTP
                 status code 200 (OK) otherwise an appropriate error message
                 and an appropriate HTTP status code
        """
        args = self.reqparser.parse_args()

        # Check if enough arguments where passed to perform a deletion
        if all(arg not in args for arg in
               ["user_id", "attribute_id", "id"]):
            # Return an error responseDid not receive enough
            # arguments to find an alert accurately
            return (dict(
                error="Insufficient Arguments",
                possible_args="user_id, attribute_id, alert_id"),
                    HTTPStatus.BAD_REQUEST)

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

        # Get Alerts using parsed args as filter arguments
        alerts = AlertWidgetModel.get_by_kwargs(**args)
        response_data = []
        for alert in alerts:
            response_data.append(alert.json)
            alert.delete()
            alert.commit()

        AlertWidgetModel.commit()

        return dict(message="Alert(s) Deleted", alerts=response_data), 200
