import numpy as np

def mean_absolute_percentage_error(y_true, y_pred): 
    """
    MAPE can be problematic as it doesnt account for missing values and there's a danger of dividing 
    by zero. Both these cases are excluded from the computation by subsetting the y_true and y_pred arrays
    """
    y_true, y_pred = np.array(y_true), np.array(y_pred)

    mask_na = ~np.isnan(y_true)
    y_true = y_true[mask_na]
    y_pred = y_pred[mask_na]
    
    mask_zeros = y_true != 0
    y_true = y_true[mask_zeros]
    y_pred = y_pred[mask_zeros]

        
    return np.mean(np.abs((y_true - y_pred) / y_true)) * 100

def is_number(s):
    """
    Checks for number
    """
    try:
        float(s)
        return True
    except ValueError:
        pass
 
    try:
        import unicodedata
        unicodedata.numeric(s)
        return True
    except (TypeError, ValueError):
        pass
 
    return False