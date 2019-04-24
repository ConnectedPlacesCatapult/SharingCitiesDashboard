import sys
import time
import unittest
from datetime import datetime

import sqlalchemy
from sqlalchemy.orm import sessionmaker, scoped_session

from app import create_app
from db import db
from models.attribute_range import AttributeRange
from models.attributes import Attributes
from models.users import Users

sys.path.append('../..')
from settings import GetConfig

config = GetConfig.configure('postgres')


class AlertWidgetDecoratorTestCase(unittest.TestCase):
    """
    Test whether the minimum and maximum values of attributes are persisted
    after an importer is run
    """

    def setUp(self):
        """
        Create testing client version of flask app along with a database
        session and then generate an admin JWT
        """

        self.test_app = create_app(DATABASE_NAME='scheduler',
                                   TESTING=True)
        self.testing_client = self.test_app.test_client()
        self.testing_client_context = self.test_app.app_context()
        self.testing_client_context.push()
        self.engine = sqlalchemy.create_engine(config['db_uri'])
        self.sess = scoped_session(sessionmaker(bind=self.engine))
        self.access_token_header = self.generate_access_token()

    def tearDown(self):
        """ Remove testing client context """

        self.testing_client_context.pop()

    def test_min_max_for_all_attributes(self):
        """
        Test whether an AttributeRange entry is created for all Attribute
        entries
        """

        response = self.testing_client.post('/importer_retry', data=dict(
            api_id=1), headers=self.access_token_header)
        self.assertEqual(response.status_code, 200)

        attributes = Attributes.get_all()
        attribute_range_entries = AttributeRange.get_all()
        attribute_ids = [attr_range.attribute_id for attr_range in
                         attribute_range_entries]

        for attr in attributes:
            self.assertIn(attr.id, attribute_ids)

    def test_update_on_new_import(self):
        """
        Test whether a AttributeRange entry is updated when new values are
        imported
        """
        o3 = Attributes.get_by_name("O3")[0]
        o3_attr_range = AttributeRange.get_by_attr_id(o3.id)
        before_import_latest_update = o3_attr_range.latest_update
        self.sess.execute(
            "INSERT INTO {} VALUES('A','99999999','{}','{}')".format(
                o3.table_name.lower(), datetime.now(), datetime.now()))
        self.sess.commit()

        response = self.testing_client.post('/importer_retry', data=dict(
            api_id=1), headers=self.access_token_header)
        self.assertEqual(response.status_code, 200)
        time.sleep(1)
        new_o3_attr_range = AttributeRange.get_by_attr_id(o3.id)
        self.assertEqual(new_o3_attr_range.maximum, 99999999)
        after_import_latest_update = new_o3_attr_range.latest_update
        self.assertGreater(after_import_latest_update,
                           before_import_latest_update)

        self.sess.execute(
            "delete from {} where s_id='A'".format(o3.table_name.lower()))
        self.sess.commit()

    def generate_access_token(self) -> {str, str}:
        """
        Generate admin access JWT.
        :return: a HTTP authorization header containing a admin access token
        """

        admin_user = Users("Admin user", "admin@FCC.com",
                           Users.generate_hash(b"1234").decode("utf8"),
                           True, True)
        admin_user.save()
        admin_user.commit()
        response_login = self.testing_client.post('/login', data=dict(
            email="admin@FCC.com", password="1234", remember=True))
        response_login_json = response_login.get_json()
        admin_user.delete()
        admin_user.commit()
        return {'Authorization': 'Bearer {}'.format(
            response_login_json["access_token"])}

