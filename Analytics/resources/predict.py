from resources.helper_functions import mean_absolute_percentage_error
import numpy as np
import pandas as pd
from fbprophet import Prophet
from datetime import datetime

'''
@Params
	values: list of values to train the model
	timestamp: list of timestamps

	The function builds a time indexed dataframe, groups it by 10minutes 
	and forecasts the next n_pred values. For more details on the calculation
	consult the github page 
	
'''
def predict(values, timestamp, n_pred):
    df = pd.DataFrame(columns = ['value', 'api_timestamp'])
    df['value'] = values
    df['api_timestamp'] = timestamp
    df['value'] = df.value.astype(float)
    df = df.set_index('api_timestamp')

    #### try to infer freq
    pred_freq = pd.infer_freq(index = df.index)

    #### if freq = None then default to 1H
    if not pred_freq:
        pred_freq = '1H'


    #### try prophet forecasting engine

    forecasting_engine = 'Prophet'

    #### resample to make predictions consistent.
    df = df.resample(pred_freq).mean()

    #### prophet requires specific naming of columns
    df = df.reset_index()
    df = df.rename(index=str, columns={'api_timestamp': 'ds', 'value': 'y'})

    #### prophet fails with inf values. Replacing them with nan
    df.replace([np.inf, -np.inf], np.nan)

    #### Instantiate the prophet object and fit
    m = Prophet()
    m.fit(df)

    #### Make forecast
    future = m.make_future_dataframe(periods=n_pred, freq=pred_freq)
    forecast = m.predict(future)

    #### Compute MAPE by refitting on 70% and testing on 30%
    df_mape = df.iloc[0: len(df)-round(len(df)/100 * 30)]
    m = Prophet()
    m.fit(df_mape)

    #### Generate the remaining 30% of the dataset as predictions
    n_pred_mape = np.abs(len(df) - len(df)-round(len(df)/100 * 30))

    #### Predict the 30%
    future_mape = m.make_future_dataframe(periods=n_pred_mape, freq=pred_freq)
    forecast_mape = m.predict(future_mape)

    #### Compute MAPE
    mape = np.round(mean_absolute_percentage_error(df.y.values[len(df_mape):len(df)],
                          forecast_mape.yhat.values[len(df_mape):len(df)]),3)

    #### Gather the forecasted values

    temp = []
    pred_timestamps = forecast.ds.values[len(df)-n_pred:len(df)]

    for i, j in enumerate(range(len(df)-n_pred,len(df))):
        temp.append({
            'Value': np.round(forecast.yhat.values[j],3),
            'Value_Upper':  np.round(forecast.yhat_upper.values[j],3),
            'Value_Lower':  np.round(forecast.yhat_lower.values[j],3),
            'Timestamp': datetime.strftime(pd.to_datetime(pred_timestamps[i]), '%Y-%m-%d %H:%M:%S')
        })

    return temp, mape, forecasting_engine

