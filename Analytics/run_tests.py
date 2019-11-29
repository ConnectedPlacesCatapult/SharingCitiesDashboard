
# TODO review and add the below tests
# from resources.test_analytics import AnalyticsTest
# from test_utility import TestUtility
# from resources.test_missing_values import TestMissingValues
# from resources.test_fill_missing_value import TestFillMissingValue
# from resources.test_request_for_data import RequestForDataTestCase
# from resources.attributes.test_attribute_alias import TestAttrAlias

import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import unittest
from resources.test_analytics_health import AnalyticsHealthCheck

if __name__ == '__main__':
    unittest.main()
