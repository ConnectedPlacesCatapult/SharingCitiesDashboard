from fbprophet import Prophet
import json

'''

    This class expects a dataset, which is a Pandas DataFrame.
    It uses Prophet library to do the timeseries forecasting.
    Currently the class only fits and predicts based on defaults set in the library

    Default for Prophet for Initiating the object

        growth='linear',
        changepoints=None,
        n_changepoints=25,
        changepoint_range=0.8,
        yearly_seasonality='auto',
        weekly_seasonality='auto',
        daily_seasonality='auto',
        holidays=None,
        seasonality_mode='additive',
        seasonality_prior_scale=10.0,
        holidays_prior_scale=10.0,
        changepoint_prior_scale=0.05,
        mcmc_samples=0,
        interval_width=0.80,
        uncertainty_samples=1000

    Default for Prophet for make_future_dataframe the model

        freq='D'

'''

class ProphetForecast(object):
    def __init__(self, dataset):
        self.dataset = dataset

    def fit(self):
        self.dataset.columns = ['ds', 'y']
        self.p = Prophet()
        self.p.fit(self.dataset)
    
    def predict(self, periods, frequency):
        future = self.p.make_future_dataframe(periods=periods, freq=frequency)
        forecast = self.p.predict(future)
        return ProphetForecastValues(forecast)

class ProphetForecastValues(object):
    def __init__(self, forecast):
        self.ds = forecast[['ds']]
        self.yhat = forecast[['yhat']]
        self.lower_limit = forecast[['yhat_lower']]
        self.upper_limit = forecast[['yhat_upper']]
        

