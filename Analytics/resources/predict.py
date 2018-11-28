from resources.holt_winters import HoltWinters
from resources.helper_functions import mean_absolute_percentage_error, timeseriesCVscore, prediction_mape_holtwinters
from scipy.optimize import minimize              
from sklearn.model_selection import TimeSeriesSplit 
from sklearn.metrics import mean_squared_error 
from sklearn.metrics import mean_absolute_error
import numpy as np

import pandas as pd

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
	df['value'] = df.value.astype(int)
	df = df.set_index('api_timestamp')

	pred_freq = '10min'
	df = df.groupby(by=[pd.TimeGrouper(pred_freq)]).mean()
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


	return temp, mape