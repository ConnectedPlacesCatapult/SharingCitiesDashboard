import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import unittest
from resources.missing_values import MissingValues
import pandas as pd
import numpy as np

class TestMissingValues(unittest.TestCase):
    def setUp(self):

        '''
            Initially the dataset looks like

                    one       two     three
                a  1.458982 -1.030842 -2.488308
                b  0.350708 -1.216445 -0.525618
                c -0.635757 -0.962894 -0.210147

            After reindexing the data it will contain blank or NaN rows

                    one       two     three
                a  1.458982 -1.030842 -2.488308
                e       NaN       NaN       NaN
                b  0.350708 -1.216445 -0.525618
                d       NaN       NaN       NaN
                c -0.635757 -0.962894 -0.210147

            After filling with blank

                    one       two     three
                a   1.45898  -1.03084  -2.48831
                e                              
                b  0.350708  -1.21645 -0.525618
                d                              
                c -0.635757 -0.962894 -0.210147

        '''

        self.dataset = pd.DataFrame(np.random.randn(3,3), index=['a', 'b', 'c'], 
                                    columns=['one', 'two', 'three'])

        self.dataset_nan = self.dataset.reindex(['a', 'e', 'b', 'd', 'c'])

        self.dataset_blank = self.dataset_nan.fillna('')

    def tearDown(self):
        pass

    def test_remove_row_with_nan(self):
        _dataset = MissingValues(self.dataset_nan).remove_rows_with_nan()

        self.assertEqual(True, self.dataset.equals(_dataset))

    def test_remove_col_with_nan(self):
        _dataset = MissingValues(self.dataset_nan).remove_cols_with_nan()

        self.assertEqual(True, _dataset.empty)

    def test_remove_row_blank_or_nan(self):
        _dataset = MissingValues(self.dataset_blank).remove_rows()

        self.assertEqual(True, self.dataset.equals(_dataset))

    def test_remove_col_blank_or_nan(self):
        _dataset = MissingValues(self.dataset_blank).remove_cols()

        self.assertEqual(True, _dataset.empty)
