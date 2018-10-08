import pandas as pd
import numpy as np

class MissingValues(object):
    def __init__(self, dataset):
        self.dataset = dataset

    def remove_rows_with_nan(self):
        return self.dataset.dropna(axis=0)

    def remove_cols_with_nan(self):
        return self.dataset.dropna(axis=1)

    def remove_rows(self):
        self.dataset = self.dataset.replace(r'^\s*$', np.nan, regex=True)
        return self.dataset.dropna(axis=0)

    def remove_cols(self):
        self.dataset = self.dataset.replace(r'^\s*$', np.nan, regex=True)
        return self.dataset.dropna(axis=1)
