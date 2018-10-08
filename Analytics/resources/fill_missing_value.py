import pandas as pd
import numpy as np

class FillMissingValues(object):
    def __init__(self, dataset):
        self.dataset = dataset

    def mean(self):
        self.replace_blank_with_nan()
        return self.mean_nan()

    def median(self):
        self.replace_blank_with_nan()
        return self.median_nan()

    def forward_fill(self):
        self.replace_blank_with_nan()
        return self.forward_fill_nan()

    def backward_fill(self):
        self.replace_blank_with_nan()
        return self.backward_fill_nan()

    def default(self, value):
        self.replace_blank_with_nan()
        return self.default_nan(value)

    # below methods only support NaN as blank could be valid value

    def mean_nan(self):
        return self.dataset.fillna(self.dataset.mean())

    def median_nan(self):
        return self.dataset.fillna(self.dataset.median())

    def forward_fill_nan(self):
        return self.dataset.fillna(method='ffill')

    def backward_fill_nan(self):
        return self.dataset.fillna(method='bfill')

    def default_nan(self, value):
        return self.dataset.fillna(value)

    def replace_blank_with_nan(self):
        self.dataset = self.dataset.replace(r'^\s*$', np.nan, regex=True)