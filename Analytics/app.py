from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from resources.analytics import Analytics
from resources.request_for_data import RequestForData
from resources.login import Login, SecretResource
from resources.refresh_token import TokenRefresh
from resources.logout import UserLogoutAccess, UserLogoutRefresh
from db import db
from flask_cors import CORS

from flask_jwt_extended import JWTManager
import datetime
from models.revoked_tokens import RevokedTokens

def create_app(**config_overrides):
    app = Flask(__name__)
    app.config.from_pyfile('settings.py')
    app.config.update(config_overrides)
    cors = CORS(app, resources={r"/*": {"origins":"*"}})
    api = Api(app)

    app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'  #TODO: change before deployement
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(weeks=1) #TODO: change before deployement
    app.config['JWT_BLACKLIST_ENABLED'] = True
    app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

    db.init_app(app)
    db.app = app

    jwt = JWTManager(app)
    @jwt.token_in_blacklist_loader
    def check_if_token_in_blacklist(decrypted_token):
        ''' Create a function that will be called whenever an access or 
            refresh token is required by and sent to an endpoint.
        '''
        jti = decrypted_token['jti']
        return RevokedTokens.is_jti_blacklisted(jti)


    @jwt.user_claims_loader
    def add_claims_to_access_token(user):
        ''' Create a function that will be called whenever create_access_token
            is used. It will take whatever object is passed into the
            create_access_token method, and lets us define what custom claims
            should be added to the access token.
        '''
        return {'admin': user.admin}


    @jwt.user_identity_loader
    def user_identity_lookup(user):
        ''' Create a function that will be called whenever create_access_token
            is used. It will take whatever object is passed into the
            create_access_token method, and lets us define what the identity
            of the access token should be.
        '''
        return user.email

    
    from models.operation import Operation
    from models.request_analytics import RequestAnalytics
    from models.request_table_cols import RequestTablesCols
    from models.request_tables import RequestTables
    from models.api import API
    from models.attributes import Attributes
    from models.sensor import Sensor
    from models.location import Location
    from models.unit import Unit
    from models.sensor_attribute import SensorAttribute 
    from models.theme import Theme, SubTheme


    from models.users import Users

    db.create_all()

    migrate = Migrate(app, db)
    api.add_resource(Analytics, '/analytics')
    api.add_resource(RequestForData, '/data')


    api.add_resource(Login, '/login')
    api.add_resource(TokenRefresh, '/refreshToken')
    api.add_resource(UserLogoutAccess, '/revokeAccess')
    api.add_resource(UserLogoutRefresh, '/revokeRefresh')
    api.add_resource(SecretResource, '/secret')

    return app
