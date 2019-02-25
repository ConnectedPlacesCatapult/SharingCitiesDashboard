"""API Resource class for revoking access and refresh tokens"""

from flask_restful import Resource
from flask_jwt_extended import  jwt_refresh_token_required, jwt_required, get_jwt_identity, create_access_token, get_raw_jwt

from models.revoked_tokens import RevokedTokens


class UserLogoutAccess(Resource):
    
    @jwt_required
    def post(self) -> (str,int):
         """
        POST request that revokes a users access JWT by adding it to the revoked_tokens table
        :required: A valid access JWT in the Authorization Header in the format - Bearer <JWT>
        :return: A message that indicates whether the token has been revoked 
        :rtype: JSON
        """
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedTokens(jti = jti)
            revoked_token.add()
            return {'message': 'Access token has been revoked'}, 200
        except:
            return {'message': 'Something went wrong'}, 500


class UserLogoutRefresh(Resource):
    
    @jwt_refresh_token_required
    def post(self) -> (str,int):
        """
        POST request that revokes a users refresh JWT by adding it to the revoked_tokens table
        :required: A valid refresh JWT in the Authorization Header in the format - Bearer <JWT>
        :return: A message that indicates whether the token has been revoked 
        :rtype: JSON
        """
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedTokens(jti = jti)
            revoked_token.add()
            return {'message': 'Refresh token has been revoked'}, 200
        except:
            return {'message': 'Something went wrong'}, 500
