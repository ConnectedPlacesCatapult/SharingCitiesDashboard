import datetime

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_restful import Api

from db import db
from models.revoked_tokens import RevokedTokens
from resources.analytics import Analytics
from resources.login import Login, SecretResource
from resources.logout import UserLogoutAccess, UserLogoutRefresh
from resources.refresh_token import TokenRefresh
from resources.request_for_data import RequestForData
from resources.register import Register
from resources.changePassword import ChangePassword

from resources.widgets import Widgets

from resources.user_admin import UserAdmin
from resources.user_permissions import UserPermissions
from resources.user_list import UsersList


# from flask_bcrypt import Bcrypt

def create_app(**config_overrides):
    app = Flask(__name__)
    app.config.from_pyfile('settings.py')
    app.config.update(config_overrides)
    cors = CORS(app, resources={r"/*": {"origins":"*"}})
    api = Api(app)

    # # Configure application to store JWTs in cookies. Whenever you make
    # # a request to a protected endpoint, you will need to send in the
    # # access or refresh JWT via a cookie.
    # app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    #
    # # Set the cookie paths, so that you are only sending your access token
    # # cookie to the access endpoints, and only sending your refresh token
    # # to the refresh endpoint. Technically this is optional, but it is in
    # # your best interest to not send additional cookies in the request if
    # # they aren't needed.
    # app.config['JWT_ACCESS_COOKIE_PATH'] = '/login'
    # app.config['JWT_REFRESH_COOKIE_PATH'] = '/refreshToken'
    #
    # # Disable CSRF protection for this example. In almost every case,
    # # this is a bad idea. See examples/csrf_protection_with_cookies.py
    # # for how safely store JWTs in cookies
    # app.config['JWT_COOKIE_CSRF_PROTECT'] = True

    app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'  #TODO: change before deployement
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(weeks=1) #TODO: change before deployement
    app.config['JWT_BLACKLIST_ENABLED'] = True
    app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

    # password_bcrypt = Bcrypt(app)
    db.init_app(app)
    db.app = app

    jwt = JWTManager(app)
    @jwt.token_in_blacklist_loader
    def check_if_token_in_blacklist(decrypted_token):
        jti = decrypted_token['jti']
        return RevokedTokens.is_jti_blacklisted(jti)

    # Create a function that will be called whenever create_access_token
    # is used. It will take whatever object is passed into the
    # create_access_token method, and lets us define what custom claims
    # should be added to the access token.
    @jwt.user_claims_loader
    def add_claims_to_access_token(user):
        return {'admin': user.admin}


    # Create a function that will be called whenever create_access_token
    # is used. It will take whatever object is passed into the
    # create_access_token method, and lets us define what the identity
    # of the access token should be.
    @jwt.user_identity_loader
    def user_identity_lookup(user):
        return user.email

    db.create_all()

    migrate = Migrate(app, db)
    api.add_resource(Analytics, '/analytics')
    api.add_resource(RequestForData, '/data')
    api.add_resource(Register, '/register')
    api.add_resource(ChangePassword, '/changePassword')


    api.add_resource(Login, '/login')
    api.add_resource(TokenRefresh, '/refreshToken')
    api.add_resource(UserLogoutAccess, '/revokeAccess')
    api.add_resource(UserLogoutRefresh, '/revokeRefresh')
    api.add_resource(SecretResource, '/secret')

    api.add_resource(Widgets, '/widgets', endpoint='widgets')
    api.add_resource(UserAdmin, '/admin', endpoint='admin')
    api.add_resource(UserPermissions, '/admin/user_permissions', endpoint='user_permissions')
    api.add_resource(UsersList, '/admin/list_users', endpoint='list_users')


    return app
