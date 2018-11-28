import os
import pandas as pd
from matplotlib import pyplot as plt
import numpy as np
from scipy.optimize import minimize              
from itertools import product
from sklearn.model_selection import TimeSeriesSplit 
from sklearn.metrics import mean_squared_error
from sklearn.metrics import mean_absolute_error
from scipy import signal
from scipy.special import comb
from scipy.optimize import least_squares
from resources.holt_winters import HoltWinters

def mean_absolute_percentage_error(y_true, y_pred): 
    """
    Returns MAPE
    """  
    y_true = y_true[y_true != 0]
    y_pred = y_pred[y_pred != 0]

    return np.mean(np.abs((y_true - y_pred) / y_true)) * 100

def prediction_mape_holtwinters(data, errors, alpha_final, beta_final, gamma_final):
    """
    Returns prediction MAPE by performing 70/10 split on data 
    """
    pred_data_fit = data.iloc[0:int((len(data)/100.) * 70)]
    pred_data_test = data.iloc[int((len(data)/100.) * 70):len(data)]
    model = HoltWinters(pred_data_fit, slen = np.arange(1,len(data), 20)[np.argmin(errors)], 
                        alpha = alpha_final, 
                        beta = beta_final, 
                        gamma = gamma_final, 
                        n_preds = len(pred_data_test), scaling_factor = 1)
    try:

        model.triple_exponential_smoothing()
        
    except Exception as e:
        if str(e) == 'index out of bounds':
            model = HoltWinters(pred_data_fit, slen = 24, 
                                alpha = alpha_final, 
                                beta = beta_final, 
                                gamma = gamma_final, 
                                n_preds = len(pred_data_test), scaling_factor = 1)
            model.triple_exponential_smoothing()
            return mean_absolute_percentage_error(pred_data_test, model.result[:len(pred_data_test)])
        else:
            return np.nan
            
    return mean_absolute_percentage_error(pred_data_test, model.result[:len(pred_data_test)])


def timeseriesCVscore(params, series, loss_function=mean_squared_error, slen=24):#SLEN=24
    """
        Returns error on CV  
        
        params - vector of parameters for optimization
        series - dataset with timeseries
        slen - season length for Holt-Winters model
    """
    # errors array
    errors = []
    values = series.values
    alpha, beta, gamma = params
    
    # set the number of folds for cross-validation
    tscv = TimeSeriesSplit(n_splits=3) 
    
    # iterating over folds, train model on each, forecast and calculate error
    for train, test in tscv.split(values):

        model = HoltWinters(series=values[train], slen=slen, 
                            alpha=alpha, beta=beta, gamma=gamma, n_preds=len(test))
        model.triple_exponential_smoothing()
        
        predictions = model.result[-len(test):]
        actual = values[test]
        error = loss_function(predictions, actual)
        errors.append(error)
        
    return np.mean(np.array(errors))

def clean_dataset(dataset, column, levels=1):
    """
    Cleaning the dataset by filtering out outliers
    """
    #### Selecting values that are less or equal 4 std from the mean
    if levels == 2:
        dataset = dataset[np.abs(dataset[column]-dataset[column].mean()) <= (4*dataset[column].std())]
        
    #### Selecting values by applying a rolling median filter
    elif levels == 3:
        dataset = dataset.rolling(5,center=True).median().fillna(method='bfill').fillna(method='ffill')
        
    #### IQR filtering (box and whisker style)
    elif levels ==4:
        q75, q25 = np.percentile(dataset[column].values, [75 ,25])
        iqr = q75 - q25
        l1 = np.percentile(dataset[column].values, 25) -  1.5 * iqr
        l3 = np.percentile(dataset[column].values, 75) +  1.5 * iqr
        dataset = dataset[(dataset[column] >= l1) 
              & (dataset[column] <= l3)]   
        
    #### Do no filtering
    elif levels == 1:
        pass
    
    else:
        print('Please specify cleaning level')
    return dataset

#### Detrending time series by taking the log and shifted differences
def detrending(dataset, column):
    ads_diff = np.log(dataset[column]) - np.log(dataset[column]).shift(1)
    ads_diff = ads_diff.fillna(method='bfill').fillna(method='ffill')
    return ads_diff