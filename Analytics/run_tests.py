import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import unittest
from resources.test_analytics import AnalyticsTest
from resources.test_missing_values import TestMissingValues

if __name__ == '__main__':
    unittest.main()