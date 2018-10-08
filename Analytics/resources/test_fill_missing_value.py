import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from resources.fill_missing_value import FillMissingValues
import unittest
import pandas as pd
import numpy as np

class TestFillMissingValue(unittest.TestCase):
    def setUp(self):
        to_test = {
            'a': [1.0, np.nan, 2.0, 3.0, 4.0],
            'b': [3, 6, 8, '', 9]
        }

        self.dataset = pd.DataFrame(to_test)

    def tearDown(self):
        pass

    def test_default_nan(self):
        _dataset = FillMissingValues(self.dataset).default_nan(6)

        self.assertTrue(pd.DataFrame({
            'a': [1.0, 6.0, 2.0, 3.0, 4.0],
            'b': [3, 6, 8, '', 9]
        }).equals(_dataset))

    def test_default(self):
        _dataset = FillMissingValues(self.dataset).default(6)

        self.assertTrue(pd.DataFrame({
            'a': [1.0, 6.0, 2.0, 3.0, 4.0],
            'b': [3.0, 6.0, 8.0, 6.0, 9.0]
        }).equals(_dataset))

    def test_mean_nan(self):
        _dataset = FillMissingValues(self.dataset).mean_nan()

        self.assertTrue(pd.DataFrame({
            'a': [1.0, 2.5, 2.0, 3.0, 4.0],
            'b': [3, 6, 8, '', 9]
        }).equals(_dataset))

    def test_mean(self):
        _dataset = FillMissingValues(self.dataset).mean()

        self.assertTrue(pd.DataFrame({
            'a': [1.0, 2.5, 2.0, 3.0, 4.0],
            'b': [3.0, 6.0, 8.0, 6.5, 9.0]
        }).equals(_dataset))

    def test_median_nan(self):
        _dataset = FillMissingValues(self.dataset).median_nan()

        self.assertTrue(pd.DataFrame({
            'a': [1.0, 2.5, 2.0, 3.0, 4.0],
            'b': [3, 6, 8, '', 9]
        }).equals(_dataset))

    def test_median(self):
        _dataset = FillMissingValues(self.dataset).median()

        self.assertTrue(pd.DataFrame({
            'a': [1.0, 2.5, 2.0, 3.0, 4.0],
            'b': [3.0, 6.0, 8.0, 7.0, 9.0]
        }).equals(_dataset))

    def test_forward_fill_nan(self):
        _dataset = FillMissingValues(self.dataset).forward_fill_nan()

        self.assertTrue(pd.DataFrame({
            'a': [1.0, 1.0, 2.0, 3.0, 4.0],
            'b': [3, 6, 8, '', 9]
        }).equals(_dataset))

    def test_forward_fill(self):
        _dataset = FillMissingValues(self.dataset).forward_fill()

        self.assertTrue(pd.DataFrame({
            'a': [1.0, 1.0, 2.0, 3.0, 4.0],
            'b': [3.0, 6.0, 8.0, 8.0, 9.0]
        }).equals(_dataset))

    def test_backward_fill_nan(self):
        _dataset = FillMissingValues(self.dataset).backward_fill_nan()

        self.assertTrue(pd.DataFrame({
            'a': [1.0, 2.0, 2.0, 3.0, 4.0],
            'b': [3, 6, 8, '', 9]
        }).equals(_dataset))

    def test_backward_fill(self):
        _dataset = FillMissingValues(self.dataset).backward_fill()

        self.assertTrue(pd.DataFrame({
            'a': [1.0, 2.0, 2.0, 3.0, 4.0],
            'b': [3.0, 6.0, 8.0, 9.0, 9.0]
        }).equals(_dataset))
