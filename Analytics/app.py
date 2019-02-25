import datetime

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_restful import Api

from db import db
from models.revoked_tokens import RevokedTokens
from resources.Widgets.create_widget_layout import CreateWidgetLayout
from resources.Widgets.delete_widget import DeleteWidgets
from resources.Widgets.get_layouts import GetLayouts
from resources.Widgets.get_widget_layout import GetWidgetLayout
from resources.Widgets.get_widgets import GetWidgets
from resources.Widgets.save_layouts import SaveWidgetLayout
from resources.Widgets.save_widgets import Widgets
from resources.admin.change_user_name import ChangeUserName
from resources.admin.change_user_password import ChangeUserPassword
from resources.admin.create_new_user import CreateNewUser
from resources.admin.delete_user import DeleteUser
from resources.admin.edit_user import EditUser
from resources.admin.get_user import GetUserByEmail
from resources.admin.user_list import UsersList
from resources.admin.user_permissions import UserPermissions
from resources.analytics import Analytics
from resources.login import Login, SecretResource
from resources.logout import UserLogoutAccess, UserLogoutRefresh
from resources.refresh_token import TokenRefresh
from resources.register import Register
from resources.request_for_data import RequestForData


def create_app(**config_overrides):
    app = Flask(__name__)
    app.config.from_pyfile('settings.py')
    app.config.update(config_overrides)
    cors = CORS(app, resources={r"/*": {"origins": "*"}})
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

    app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'  # TODO: change before deployement
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(weeks=1)  # TODO: change before deployement
    app.config['JWT_BLACKLIST_ENABLED'] = True
    app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

    db.init_app(app)
    db.app = app

    jwt = JWTManager(app)

    @jwt.token_in_blacklist_loader
    def check_if_token_in_blacklist(decrypted_token):
        """ 
        Query revoked tokens table for presence of decrypted_token argument
        :param decrypted_token: Decrypted version of a user's JWT
        :type decrypted_token: string
        :return: Whether the decrypted token is present in revoked tokens table
        :rtype: bool
        """
        jti = decrypted_token['jti']
        return RevokedTokens.is_jti_blacklisted(jti)

    @jwt.user_claims_loader
    def add_claims_to_access_token(user):
        """ 
        Add admin claim to access token
        :param user: Users model
        :type user: Users instance
        :return: Admin claim to be added to access JWT
        :rtype: JSON
        """
        return {'admin': user.admin}

    @jwt.user_identity_loader
    def user_identity_lookup(user) -> str:
        """ 
        Define identity claim within JWT token
        :param user: Users model
        :type user: Users instance
        :return: Identifier for a JWT
        :rtype: str
        """
        return user.email

    db.create_all()

    migrate = Migrate(app, db)
    api.add_resource(Analytics, '/analytics')
    api.add_resource(RequestForData, '/data')  # current /data endpoint

    # login Endpoints
    api.add_resource(Register, '/register')
    api.add_resource(Login, '/login')
    api.add_resource(TokenRefresh, '/refreshToken')
    api.add_resource(UserLogoutAccess, '/revokeAccess')
    api.add_resource(UserLogoutRefresh, '/revokeRefresh')
    api.add_resource(SecretResource, '/secret')

    # Widget Endpoints
    api.add_resource(Widgets, '/widgets/create_widget')
    api.add_resource(CreateWidgetLayout, '/widgets/create_layout')
    api.add_resource(GetWidgets, '/widgets/load_widgets')
    api.add_resource(DeleteWidgets, '/widgets/delete_widget')
    api.add_resource(GetWidgetLayout, '/widgets/get_layout')
    api.add_resource(GetLayouts, '/widgets/get_layouts')
    api.add_resource(SaveWidgetLayout, '/widgets/save_layouts')

    # Admin Endpoints
    api.add_resource(CreateNewUser, '/admin/create_new_user')
    api.add_resource(GetUserByEmail, '/admin/get_user_by_email')
    api.add_resource(UserPermissions, '/admin/set_user_permissions')
    api.add_resource(UsersList, '/admin/list_users')
    api.add_resource(ChangeUserName, '/admin/change_user_fullname')
    api.add_resource(ChangeUserPassword, '/admin/change_user_password')
    api.add_resource(DeleteUser, '/admin/delete_user')
    api.add_resource(EditUser, '/admin/edit_user')

    return app
