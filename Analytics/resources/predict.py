from resources.holt_winters import HoltWinters
from resources.helper_functions import mean_absolute_percentage_error, timeseriesCVscore, prediction_mape_holtwinters
from scipy.optimize import minimize              
from sklearn.metrics import mean_squared_error 
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
	try:
		forecasting_engine = 'Prophet'

		#### resample to make predictions consistent. 
		df = df.resample(pred_freq).mean()

		#### prophet requires specific naming of columns 
		df = df.reset_index()
		df = df.rename(index=str, columns={'api_timestamp': 'ds', 'value': 'y'})

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

	except Exception as e:
		#### TODO log the error
		try:
			forecasting_engine = 'Holt-Winters'

			df = df.resample(pred_freq).mean()
			df = df.fillna(method='ffill').fillna(method='ffill')
			df.dropna(inplace=True)
			
			#### Optimise alpha, beta, gamma by cross validation
			x = [0, 0, 0] 
			opt = minimize(timeseriesCVscore, x0=x, 
			               args=(df.value), 
			               method=None, bounds = ((0, 1), (0, 1), (0, 1))
			              )


			alpha_final, beta_final, gamma_final = opt.x

			#### Optimise slen by taking the minimum mean_squared_error
			errors = []
			for x in np.arange(1,len(df), 20):
			    try:

			        model = HoltWinters(df.value, slen = int(x), 
			                            alpha = alpha_final, 
			                            beta = beta_final, 
			                            gamma = gamma_final, 
			                            n_preds = 0, scaling_factor = 1)
			        model.triple_exponential_smoothing()

			        error = mean_squared_error(df, model.result)
			        errors.append(error)
			    except Exception:
			        pass

			
			model = HoltWinters(df.value, slen = np.arange(1,len(df), 20)[np.argmin(errors)], 
			                    alpha = alpha_final, 
			                    beta = beta_final, 
			                    gamma = gamma_final, 
			                    n_preds = n_pred, scaling_factor = 1)
			model.triple_exponential_smoothing() 

			temp = []
			pred_timestamps = pd.date_range(start = df.index[-1], end= df.index[-1] +n_pred, freq=pred_freq)

			for i, j in enumerate(range(len(df)-1,len(model.result))):
				temp.append({
					'Value': np.round(model.result[j],3),
					'Value_Upper':  np.round(model.UpperBond[j],3),
					'Value_Lower':  np.round(model.LowerBond[j],3),
					'Timestamp': str(pred_timestamps[i])
				})

			mape = np.round(prediction_mape_holtwinters(df.value, errors, alpha_final, beta_final, gamma_final),3)


			return temp, mape, forecasting_engine

		except Exception as e:
			print(str(e))
			#### TODO log the error
			return None, None, None

