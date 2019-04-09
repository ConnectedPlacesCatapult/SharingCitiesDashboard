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
from resources.attributes import AttributeAlias
from resources.attributes import DeleteAttributeAlias
from resources.attributes import GetAttributes
from resources.attributes import UpdateAttributeSubTheme
from resources.export_data import ExportData
from resources.forgot_password import ForgotPassword
from resources.import_retry import ImportRetry
from resources.import_status import ImportStatus
from resources.login import Login, SecretResource
from resources.logout import UserLogoutAccess, UserLogoutRefresh
from resources.moving_sensors import CreateTracker
from resources.moving_sensors import DeleteTracker
from resources.moving_sensors import ExportToKML
from resources.moving_sensors import GetDummyData
from resources.moving_sensors import GetTracker
from resources.moving_sensors import UpdateTracker
from resources.moving_sensors.add_new_location_data import AddNewLocationData
from resources.moving_sensors.delete_location_data import DeleteLocationData
from resources.moving_sensors.get_location_data import GetLocationData
from resources.moving_sensors.remove_location_data import WindowLocationData
from resources.refresh_token import TokenRefresh
from resources.register import Register
from resources.request_for_data import PredictionStatus
from resources.request_for_data import RequestForData
from resources.themes import AddSubTheme
from resources.themes import AddTheme
from resources.themes import DeleteSubTheme
from resources.themes import DeleteTheme
from resources.themes import GetSubThemes
from resources.themes import GetThemeTree
from resources.themes import GetThemes
from resources.themes import RenameSubTheme
from resources.themes import RenameTheme
from resources.units.add_new_unit import AddUnitOfMeasurement
from resources.units.delete_unit import DeleteUnitOfMeasurement
from resources.units.get_all_units import GetAllUnitsOfMeasure
from resources.units.get_unit import GetUnitOfMeasure
from resources.units.update_unit import UpdateUnitOfMeasure
from resources.moving_sensors import GetDummyData
from resources.sendgrid_management import TestKeyValidity, ReplaceKey


def create_app(**config_overrides):
    app = Flask(__name__)
    app.config.from_pyfile('settings.py')
    app.config.update(config_overrides)
    CORS(app)
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

    app.config[
        'JWT_SECRET_KEY'] = 'jwt-secret-string'  # TODO: change before deployment
    # app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(weeks=1)  # TODO: change before deployment
    app.config['JWT_BLACKLIST_ENABLED'] = True
    app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

    db.init_app(app)
    db.app = app

    jwt = JWTManager(app)

    @jwt.token_in_blacklist_loader
    def check_if_token_in_blacklist(decrypted_token: dict) -> bool:
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
    def add_claims_to_access_token(user: db.Model) -> dict:
        """
        Add admin claim to access token
        :param user: Users model
        :type user: Users instance
        :return: Admin claim to be added to access JWT
        :rtype: JSON
        """
        return {'admin': user.admin}

    @jwt.user_identity_loader
    def user_identity_lookup(user: db.Model) -> str:
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
    api.add_resource(PredictionStatus, '/pred_status')

    # login Endpoints
    api.add_resource(Register, '/register')
    api.add_resource(Login, '/login')
    api.add_resource(TokenRefresh, '/refreshToken')
    api.add_resource(UserLogoutAccess, '/revokeAccess')
    api.add_resource(UserLogoutRefresh, '/revokeRefresh')
    api.add_resource(SecretResource, '/secret')
    api.add_resource(ForgotPassword, '/forgot_password')

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

    # Unit Endpoints
    api.add_resource(AddUnitOfMeasurement, '/admin/units/add')
    api.add_resource(DeleteUnitOfMeasurement, '/admin/units/delete')
    api.add_resource(GetUnitOfMeasure, '/admin/units/get')
    api.add_resource(GetAllUnitsOfMeasure, '/admin/units/get_all')
    api.add_resource(UpdateUnitOfMeasure, '/admin/units/update')

    # Theme Endpoints
    api.add_resource(AddTheme, '/admin/themes/add_theme')
    api.add_resource(RenameTheme, '/admin/themes/rename_theme')
    api.add_resource(DeleteTheme, '/admin/themes/delete_theme')
    api.add_resource(GetThemes, '/admin/themes/get_themes')
    api.add_resource(GetThemeTree, '/admin/themes/get_tree')

    # Sub Theme Endpoints
    api.add_resource(AddSubTheme, '/admin/themes/add_subtheme')
    api.add_resource(RenameSubTheme, '/admin/themes/rename_subtheme')
    api.add_resource(DeleteSubTheme, '/admin/themes/delete_subtheme')
    api.add_resource(GetSubThemes, '/admin/themes/get_subthemes')

    # Attribute Alias Endpoints
    api.add_resource(AttributeAlias, '/admin/attributes/alias')
    api.add_resource(GetAttributes, '/admin/attributes/get_attributes')
    api.add_resource(DeleteAttributeAlias, '/admin/attributes/delete_alias')
    api.add_resource(UpdateAttributeSubTheme,
                     '/admin/attributes/add_to_subtheme')

    api.add_resource(ExportData, '/export_data')
    api.add_resource(ImportStatus, '/importer_status')
    api.add_resource(ImportRetry, '/importer_retry')

    api.add_resource(CreateTracker, '/moving/add_tracker')
    api.add_resource(DeleteTracker, '/moving/delete_tracker')
    api.add_resource(UpdateTracker, '/moving/update_tracker')
    api.add_resource(GetTracker, '/moving/get_tracker')

    api.add_resource(AddNewLocationData, '/moving/add_new_data')
    api.add_resource(DeleteLocationData, '/moving/delete_location_data')
    api.add_resource(GetLocationData, '/moving/get_loc_data')
    api.add_resource(WindowLocationData, '/moving/window_data')

    api.add_resource(ExportToKML, '/moving/export_kml')
    api.add_resource(GetDummyData, '/moving/fetch_dummy_data')

    api.add_resource(TestKeyValidity, "/sendgrid/test_key_validity")
    api.add_resource(ReplaceKey, "/sendgrid/replace_key")

    return app
