from flask_restful import Resource
from flask_jwt_extended import  jwt_refresh_token_required, get_jwt_identity, create_access_token
from models.users import Users

class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity() # extracts the users identity from the refresh token
        current_user = Users.find_by_email(current_user)
        access_token = create_access_token(identity = current_user)
        return {'access_token': access_token}