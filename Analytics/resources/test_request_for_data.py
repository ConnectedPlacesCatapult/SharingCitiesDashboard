
import unittest

from app import create_app
from models.theme import Theme, SubTheme
from models.attributes import Attributes


class RequestForDataTestCase(unittest.TestCase):
    """
    Test retrieving data from backend
    """

    def setUp(self):
        """
        Initialise Flask application, save the current application context for
        the duration of a single test and yield a testing client for making
        requests to the endpoints exposed by the application
        """
        self.test_app = create_app(DATABASE_NAME='test_analytics_2', TESTING=True)
        self.testing_client = self.test_app.test_client()

        self.testing_client_context = self.test_app.app_context()
        self.testing_client_context.push()

    def tearDown(self):
        """Remove testing client"""
        self.testing_client_context.pop()

    def test_return_empty_params(self):
        """
        Test sending empty param's return themes
        """
        themes = Theme.get_all()
        response = self.testing_client.get('/data')

        self.assertEqual([a.json() for a in themes], response.get_json())

    def test_return_subthemes_of_theme(self):
        """
        Adding a theme and subtheme (linked to to that theme) to the database and then
        testing to see if it is retrieved correctly
        """
        theme = Theme(name='Test_Theme')
        theme.save()
        theme.commit()

        sub_theme = SubTheme(theme.id, "Test_Sub_Theme")
        sub_theme.save()
        sub_theme.commit()

        response = self.testing_client.get('/data', data=dict(theme=theme.id))

        self.assertEqual(sub_theme.json(), response.get_json())

        sub_theme.delete()
        sub_theme.commit()

        theme.delete()
        theme.commit()

    def test_return_attribute_of_subtheme(self):
        """
        Adding a theme and subtheme to the database and then testing to see if it's data is
        retrieved correctly
        """

        theme = Theme("Test_Theme")
        theme.save()
        theme.commit()

        sub_theme = SubTheme(theme.id, "Test_Sub_Theme")
        sub_theme.save()
        sub_theme.commit()

        attributes = Attributes("1234567890-123456789-123456789",
                                "_test_attribute_",
                                "_table_name_",
                                sub_theme.id, 1)
        attributes.save()
        attributes.commit()

        response = self.testing_client.get('/data', data=dict(subtheme=theme.id))

        self.assertEqual(theme.json(), response.get_json())

        attributes.delete()
        attributes.commit()

        sub_theme.delete()
        sub_theme.commit()

        theme.delete()
        theme.commit()


if __name__ == '__main__':
    unittest.main()
