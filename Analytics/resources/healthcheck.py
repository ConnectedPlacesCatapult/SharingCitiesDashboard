"""Provide a 200 healthy response Resource."""
from flask_restful import Resource


class HealthCheck(Resource):
    """
    HealthCheck Flask Resource.

    Provides a resource that on a GET returns a 200 and json {"Healthy": true}.
    """

    def get(self):
        """Implement GET method."""
        return {"healthy": True}, 200
