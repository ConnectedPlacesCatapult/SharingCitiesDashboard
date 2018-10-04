import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import unittest
from utility import current_time, convert_to_date
from datetime import datetime

class TestUtility(unittest.TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_convert_to_date(self):
        valid, d = convert_to_date('12-03-2018 00:00:00')
        invalid, d = convert_to_date('notdate')

        self.assertTrue(valid)
        self.assertFalse(invalid)