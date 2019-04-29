from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from flask_restful import inputs
from flask_restful import reqparse

from models.alert_model import AlertWidgetModel
from models.users import Users


class CreateAlert(Resource):
    """
    Create an alert. Takes a minimum and maximum threshold value, an
    attribute id, widget id and a optional user id.
    """

    def __init__(self) -> None:
        """
        Instantiate reparse for POST request.
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('user_id', required=False, type=int,
                                    store_missing=False,
                                    location=['form', 'json'])
        self.reqparser.add_argument('widget_id', required=True, type=int,
                                    help='widget Id missing',
                                    location=['form', 'json'])
        self.reqparser.add_argument('activated', required=False,
                                    type=inputs.boolean,
                                    default=True,
                                    location=['form', 'json'])
        self.reqparser.add_argument('attribute_id', required=True, type=str,
                                    help='Attribute Id missing',
                                    location=['form', 'json'])
        self.reqparser.add_argument('max_threshold', required=False,
                                    type=float,
                                    help='Max Threshold Value missing',
                                    location=['form', 'json'])
        self.reqparser.add_argument('min_threshold', required=False,
                                    type=float,
                                    help='Min Threshold Value missing',
                                    location=['form', 'json'])

    @jwt_required
    def post(self) -> (dict, HTTPStatus):
        """
        Create an alert.
        :return: On success return the new alert Id and an HTTP status code 201
                (Created), Otherwise return an error with the appropriate
                HTTP status code
        """
        args = self.reqparser.parse_args()

        if "user_id" not in args:
            # Not user_id in args get current user_id
            user = Users.find_by_email(get_jwt_identity())
            if user:
                args["user_id"] = user.id
            else:
                # Return Error current user id not found
                return (dict(error="User id not found for Current user, "
                                   "User session may have timed out"),
                        HTTPStatus.INTERNAL_SERVER_ERROR)

        elif not Users.find_by_id(args["user_id"]):
            # User not found return an error
            return dict(error="User id {} not found".format(
                args["user_id"])), HTTPStatus.NOT_FOUND

        if "max_threshold" not in args and "min_threshold" not in args:
            # No Threshold value in args at least one is required return an error
            return dict(
                error="A Threshold value is required"), HTTPStatus.BAD_REQUEST

        # Create AlertModel
        alert_model = AlertWidgetModel(args["user_id"], args["widget_id"],
                                       args["attribute_id"],
                                       args["max_threshold"],
                                       args["min_threshold"],
                                       args["activated"])

        if not alert_model:
            # Unable to create AlertModel return an error
            return dict(error="Unable to create Alert", args=args), \
                   HTTPStatus.INTERNAL_SERVER_ERROR
        # Persist Alert to database
        alert_model.save()
        alert_model.commit()

        return dict(id=alert_model.id), HTTPStatus.CREATED
