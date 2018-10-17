# Sharing Cities Analytics

[![wercker status](https://app.wercker.com/status/350323c0db166acb5049b26ec2330f42/s/master "wercker status")](https://app.wercker.com/project/byKey/350323c0db166acb5049b26ec2330f42)

Sharing Cities Analytics API allow user of the Sharing Cities Dashboard to perform analytics on datasets. The operations user can perform are:
- [Regression](https://en.wikipedia.org/wiki/Regression)
- [Clustering](https://en.wikipedia.org/wiki/Cluster_analysis)
- [Classification](https://en.wikipedia.org/wiki/Statistical_classification)

The primary purpose of all 3 operations are to extract patterns and make predictions using historical data. \
The analytical functionality of Sharing Cities is based on [prophet](https://facebook.github.io/prophet/docs/quick_start.html) and [scikit learn](http://scikit-learn.org/stable/)

## Requirements

- Postgresql
- Git
- Python 3

To setup the API locally, please see the requirement.txt for packages required to run the API \
Do a pip install on the requirements.txt

```bash

pip install -r requirements.txt

```

The API should be called using POST and passing in request parameters are JSON.

## Installation Guide
- [Windows]() - Coming soon
- [Mac]() - Coming soon
- [Ubuntu]() - Coming soon

### Parameters

- columnsX(Dependent Variables):
    - It is a mandatory field
    - Requires a dictionary with table names as keys and column names as list
- columnY(Independent Variable):
    - It is a mandatory field
    - Requires a string mentioning the column name
- tableY:
    - It is a mandatory field
    - Requires a string representing the table name of columnY
- operation:
    - It is a mandatory field
    - Requires a string representing what user would like to do with data e.g user could pass 'regression', 'classification', 'clustering' any other value would result in an error.
- requestor_id:
    - It is a mandatory field
    - It is the user id of the user initiating the task
- timeseries:
    - A mandatory field
    - It is a boolean value representing whether it is a timeseries request.
- missingValues:
    - A mandatory field
    - It helps user define an operation that would be performed in case of a missing value from the dataset e.g if user chooses to pass 'mean' then the missing values in the dataset would be replaced by the mean of the column. Valid options are:
        - Remove
        - Mean
        - Median
        - Default (a user passed value)
        - Forward Fill
        - Backward Fill
- dataRange:
    - Not a mandatory field
    - User can specify the date range from which data can ve choosen. e.g to specify choose data between 1st July 2018 to 1st September 2018, user can pass '01-07-2018 00:00:00 . 01-09-2018 00:00:00'. The date on the left side of the dot operator is 'from date' and date on the right side of the dot operator is 'to date'.

## Example Query

```bash

{
"columnsX": {
	"table1": ["col1", "col2", "col3"],
	"table2": ["col4", "col5", "col6"]
},
"columnY": "ycola",
"tableY": "table3",
"operation": "classification",
"requestor_id": 456,
"timeseries": "True",
"missingValues": "mean",
"dataRangeFrom": "12-03-2018 00:00:00",
"dataRangeTo": "14-03-2018 00:00:00"
}

```

## Example Response in case of successful response

```bash

{
    "status": {
        "message": "Request Accepted",
        "id": 8,
        "user": 456,
        "timestamp": "04-10-2018 15:37:11"
    }
}

```

## Example Response in case of error

```bash
Suppose we didn't pass what needs to be done with missing values

{
    "message": {
        "missingValues": "Provide what needs to be done with missing values"
    }
}

```

**Note: This repo is in active development and documentation will be frequently updated**

