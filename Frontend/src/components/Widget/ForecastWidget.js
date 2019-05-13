import React from 'react';
import PropTypes from 'prop-types';
import {
  Fade,
  withStyles,
} from '@material-ui/core';
import VegaLite from 'react-vega-lite';
import { Handler } from 'vega-tooltip';
import { axiosInstance } from './../../api/axios';
import WidgetWrapper from './WidgetWrapper';
import LoadingIndicator from './LoadingIndicator';

const styles = (theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'inherit',
    width: 'inherit',
    marginTop: -theme.spacing.unit * 3,
  },
});

const tooltipOptions = {
  theme: 'custom',
  styleId: 'customTooltip',
};

class ForecastWidget extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    isStatic: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    queryParams: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const { theme, config, width, height } = this.props;

    const titleTypography = theme.typography.body1;
    const labelTypography = theme.typography.body2;

    this.state = {
      loading: null,
      error: null,
      data: null,
      spec: {
        ...config.spec,
        width: width,
        height: height,
        config: {
          axis: {
            // x & y axis lines
            domainColor: theme.palette.primary.main,

            // grid
            gridColor: theme.palette.primary.main,

            // x & y axis labels
            labelColor: theme.palette.primary.main,
            labelFont: labelTypography.fontFamily,
            labelFontSize: parseFloat(labelTypography.fontSize) * theme.typography.fontSize,
            labelFontWeight: labelTypography.fontWeight,

            // axis titles
            titleColor: titleTypography.color,
            titleFont: titleTypography.fontFamily,
            titleFontSize: parseFloat(titleTypography.fontSize) * theme.typography.fontSize,
            titleFontWeight: titleTypography.fontWeight,
            titlePadding: theme.spacing.unit,

            tickColor: theme.palette.primary.main,
          },
          legend: {
            titleColor: titleTypography.color,
            titleFont: titleTypography.fontFamily,
            titleFontSize: parseFloat(titleTypography.fontSize) * theme.typography.fontSize,
            titleFontWeight: titleTypography.fontWeight,

            labelColor: theme.palette.primary.main,
            labelFont: labelTypography.fontFamily,
            labelFontSize: parseFloat(labelTypography.fontSize) * theme.typography.fontSize,
            labelFontWeight: labelTypography.fontWeight,
          },

          title: {
            color: theme.palette.primary.main,
            font: labelTypography.fontFamily,
            fontSize: parseFloat(labelTypography.fontSize) * theme.typography.fontSize,
            fontWeight: labelTypography.fontWeight,
          },
        },
      },
    };

    this.tooltipHandler = new Handler(tooltipOptions);
    this.eventSource = null;
  }

  componentWillMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  fetchData = () => {
    const { queryParams } = this.props;

    this.setState({ loading: true });

    axiosInstance
      .get('/data', { params: { ...queryParams }})
      .then((response) => {

        // parse original data
        const formattedData = response.data[0]['Attribute_Values'].map((record) => ({
          Attribute: record['Attribute_Name'],
          Timestamp: record['Timestamp'],
          Value: record['Value'],
        }));

        const taskID = response.data[1]['task_id'];

        this.setState({
          loading: false,
          data: {
            values: formattedData,
          },
        });

        // now connect to SSEs
        if (this.eventSource === null) {
          const apiUrl = `${process.env.NODE_HOST}${process.env.API_PORT}`;
          const path = '/pred_status';
          const args = `?task_id=${taskID}`;

          this.eventSource = new EventSource(`${apiUrl}${path}${args}`);
          this.eventSource.onerror = (err) => {
            console.log(err);
          };
          this.eventSource.onmessage = (e) => {

            console.log(e);

            if (e.state === "SUCCESS") {
              console.log("success");

              const formattedPredictions = e.result.Predictions.map((record) => ({
                Attribute: `${queryParams.attributedata}-predicted`,
                Timestamp: record['Timestamp'],
                Value: record['Value'],
              }));

              this.setState(prevState => ({
                data: {
                  values: [...prevState.values, formattedPredictions]
                }
              }));
            }


            /**
             *
             * {
  "state": "SUCCESS",
  "status": "task complete",
  "result": {
    "Sensor_id": "All sensors",
    "Forcasting_engine": "Prophet",
    "Mean_Absolute_Percentage_Error": 2534.819,
    "Prediction_id": 3,
    "Predictions": [
      {
        "Value": 5.834,
        "Value_Upper": 6.417,
        "Value_Lower": 5.259,
        "Timestamp": "2019-05-06 09:00:00"
      },
      {
        "Value": 6.321,
        "Value_Upper": 6.869,
        "Value_Lower": 5.744,
        "Timestamp": "2019-05-06 10:00:00"
      },
      {
        "Value": 7.484,
        "Value_Upper": 8.042,
        "Value_Lower": 6.843,
        "Timestamp": "2019-05-06 11:00:00"
      },
      {
        "Value": 9.763,
        "Value_Upper": 10.36,
        "Value_Lower": 9.136,
        "Timestamp": "2019-05-06 12:00:00"
      },
      {
        "Value": 12.778,
        "Value_Upper": 13.413,
        "Value_Lower": 12.17,
        "Timestamp": "2019-05-06 13:00:00"
      },
      {
        "Value": 15.287,
        "Value_Upper": 15.876,
        "Value_Lower": 14.681,
        "Timestamp": "2019-05-06 14:00:00"
      },
      {
        "Value": 15.944,
        "Value_Upper": 16.523,
        "Value_Lower": 15.34,
        "Timestamp": "2019-05-06 15:00:00"
      },
      {
        "Value": 14.318,
        "Value_Upper": 14.986,
        "Value_Lower": 13.767,
        "Timestamp": "2019-05-06 16:00:00"
      },
      {
        "Value": 11.297,
        "Value_Upper": 11.921,
        "Value_Lower": 10.731,
        "Timestamp": "2019-05-06 17:00:00"
      },
      {
        "Value": 8.48,
        "Value_Upper": 9.041,
        "Value_Lower": 7.844,
        "Timestamp": "2019-05-06 18:00:00"
      },
      {
        "Value": 7.048,
        "Value_Upper": 7.599,
        "Value_Lower": 6.446,
        "Timestamp": "2019-05-06 19:00:00"
      },
      {
        "Value": 7.024,
        "Value_Upper": 7.624,
        "Value_Lower": 6.45,
        "Timestamp": "2019-05-06 20:00:00"
      },
      {
        "Value": 7.504,
        "Value_Upper": 8.09,
        "Value_Lower": 6.887,
        "Timestamp": "2019-05-06 21:00:00"
      },
      {
        "Value": 7.57,
        "Value_Upper": 8.176,
        "Value_Lower": 6.948,
        "Timestamp": "2019-05-06 22:00:00"
      },
      {
        "Value": 7.043,
        "Value_Upper": 7.626,
        "Value_Lower": 6.408,
        "Timestamp": "2019-05-06 23:00:00"
      },
      {
        "Value": 6.471,
        "Value_Upper": 7.068,
        "Value_Lower": 5.839,
        "Timestamp": "2019-05-07 00:00:00"
      },
      {
        "Value": 6.492,
        "Value_Upper": 7.074,
        "Value_Lower": 5.908,
        "Timestamp": "2019-05-07 01:00:00"
      },
      {
        "Value": 7.232,
        "Value_Upper": 7.834,
        "Value_Lower": 6.66,
        "Timestamp": "2019-05-07 02:00:00"
      },
      {
        "Value": 8.297,
        "Value_Upper": 8.912,
        "Value_Lower": 7.688,
        "Timestamp": "2019-05-07 03:00:00"
      },
      {
        "Value": 9.23,
        "Value_Upper": 9.777,
        "Value_Lower": 8.639,
        "Timestamp": "2019-05-07 04:00:00"
      },
      {
        "Value": 9.913,
        "Value_Upper": 10.522,
        "Value_Lower": 9.324,
        "Timestamp": "2019-05-07 05:00:00"
      },
      {
        "Value": 10.511,
        "Value_Upper": 11.096,
        "Value_Lower": 9.888,
        "Timestamp": "2019-05-07 06:00:00"
      },
      {
        "Value": 11.126,
        "Value_Upper": 11.801,
        "Value_Lower": 10.568,
        "Timestamp": "2019-05-07 07:00:00"
      },
      {
        "Value": 11.613,
        "Value_Upper": 12.24,
        "Value_Lower": 11.006,
        "Timestamp": "2019-05-07 08:00:00"
      },
      {
        "Value": 11.836,
        "Value_Upper": 12.428,
        "Value_Lower": 11.22,
        "Timestamp": "2019-05-07 09:00:00"
      },
      {
        "Value": 12.041,
        "Value_Upper": 12.619,
        "Value_Lower": 11.47,
        "Timestamp": "2019-05-07 10:00:00"
      },
      {
        "Value": 12.851,
        "Value_Upper": 13.48,
        "Value_Lower": 12.242,
        "Timestamp": "2019-05-07 11:00:00"
      },
      {
        "Value": 14.708,
        "Value_Upper": 15.261,
        "Value_Lower": 14.129,
        "Timestamp": "2019-05-07 12:00:00"
      },
      {
        "Value": 17.234,
        "Value_Upper": 17.868,
        "Value_Lower": 16.661,
        "Timestamp": "2019-05-07 13:00:00"
      },
      {
        "Value": 19.19,
        "Value_Upper": 19.789,
        "Value_Lower": 18.565,
        "Timestamp": "2019-05-07 14:00:00"
      },
      {
        "Value": 19.237,
        "Value_Upper": 19.825,
        "Value_Lower": 18.592,
        "Timestamp": "2019-05-07 15:00:00"
      },
      {
        "Value": 16.948,
        "Value_Upper": 17.537,
        "Value_Lower": 16.307,
        "Timestamp": "2019-05-07 16:00:00"
      },
      {
        "Value": 13.215,
        "Value_Upper": 13.817,
        "Value_Lower": 12.578,
        "Timestamp": "2019-05-07 17:00:00"
      },
      {
        "Value": 9.647,
        "Value_Upper": 10.242,
        "Value_Lower": 9.035,
        "Timestamp": "2019-05-07 18:00:00"
      },
      {
        "Value": 7.432,
        "Value_Upper": 8.061,
        "Value_Lower": 6.846,
        "Timestamp": "2019-05-07 19:00:00"
      },
      {
        "Value": 6.599,
        "Value_Upper": 7.191,
        "Value_Lower": 5.991,
        "Timestamp": "2019-05-07 20:00:00"
      },
      {
        "Value": 6.255,
        "Value_Upper": 6.866,
        "Value_Lower": 5.659,
        "Timestamp": "2019-05-07 21:00:00"
      },
      {
        "Value": 5.487,
        "Value_Upper": 6.075,
        "Value_Lower": 4.907,
        "Timestamp": "2019-05-07 22:00:00"
      },
      {
        "Value": 4.128,
        "Value_Upper": 4.737,
        "Value_Lower": 3.579,
        "Timestamp": "2019-05-07 23:00:00"
      },
      {
        "Value": 2.734,
        "Value_Upper": 3.305,
        "Value_Lower": 2.144,
        "Timestamp": "2019-05-08 00:00:00"
      },
      {
        "Value": 1.952,
        "Value_Upper": 2.575,
        "Value_Lower": 1.359,
        "Timestamp": "2019-05-08 01:00:00"
      },
      {
        "Value": 1.917,
        "Value_Upper": 2.528,
        "Value_Lower": 1.32,
        "Timestamp": "2019-05-08 02:00:00"
      },
      {
        "Value": 2.243,
        "Value_Upper": 2.851,
        "Value_Lower": 1.63,
        "Timestamp": "2019-05-08 03:00:00"
      },
      {
        "Value": 2.483,
        "Value_Upper": 3.106,
        "Value_Lower": 1.877,
        "Timestamp": "2019-05-08 04:00:00"
      },
      {
        "Value": 2.524,
        "Value_Upper": 3.12,
        "Value_Lower": 1.901,
        "Timestamp": "2019-05-08 05:00:00"
      },
      {
        "Value": 2.542,
        "Value_Upper": 3.148,
        "Value_Lower": 1.946,
        "Timestamp": "2019-05-08 06:00:00"
      },
      {
        "Value": 2.644,
        "Value_Upper": 3.261,
        "Value_Lower": 2.015,
        "Timestamp": "2019-05-08 07:00:00"
      },
      {
        "Value": 2.691,
        "Value_Upper": 3.304,
        "Value_Lower": 2.107,
        "Timestamp": "2019-05-08 08:00:00"
      },
      {
        "Value": 2.553,
        "Value_Upper": 3.172,
        "Value_Lower": 1.913,
        "Timestamp": "2019-05-08 09:00:00"
      },
      {
        "Value": 2.48,
        "Value_Upper": 3.058,
        "Value_Lower": 1.901,
        "Timestamp": "2019-05-08 10:00:00"
      },
      {
        "Value": 3.099,
        "Value_Upper": 3.69,
        "Value_Lower": 2.518,
        "Timestamp": "2019-05-08 11:00:00"
      },
      {
        "Value": 4.853,
        "Value_Upper": 5.448,
        "Value_Lower": 4.253,
        "Timestamp": "2019-05-08 12:00:00"
      },
      {
        "Value": 7.368,
        "Value_Upper": 7.986,
        "Value_Lower": 6.785,
        "Timestamp": "2019-05-08 13:00:00"
      },
      {
        "Value": 9.405,
        "Value_Upper": 10.02,
        "Value_Lower": 8.813,
        "Timestamp": "2019-05-08 14:00:00"
      },
      {
        "Value": 9.623,
        "Value_Upper": 10.219,
        "Value_Lower": 9.028,
        "Timestamp": "2019-05-08 15:00:00"
      },
      {
        "Value": 7.595,
        "Value_Upper": 8.193,
        "Value_Lower": 6.976,
        "Timestamp": "2019-05-08 16:00:00"
      },
      {
        "Value": 4.211,
        "Value_Upper": 4.832,
        "Value_Lower": 3.646,
        "Timestamp": "2019-05-08 17:00:00"
      },
      {
        "Value": 1.075,
        "Value_Upper": 1.663,
        "Value_Lower": 0.455,
        "Timestamp": "2019-05-08 18:00:00"
      },
      {
        "Value": -0.629,
        "Value_Upper": -0.04,
        "Value_Lower": -1.237,
        "Timestamp": "2019-05-08 19:00:00"
      },
      {
        "Value": -0.877,
        "Value_Upper": -0.256,
        "Value_Lower": -1.49,
        "Timestamp": "2019-05-08 20:00:00"
      },
      {
        "Value": -0.569,
        "Value_Upper": -0.046,
        "Value_Lower": -1.165,
        "Timestamp": "2019-05-08 21:00:00"
      },
      {
        "Value": -0.624,
        "Value_Upper": -0.049,
        "Value_Lower": -1.238,
        "Timestamp": "2019-05-08 22:00:00"
      },
      {
        "Value": -1.218,
        "Value_Upper": -0.627,
        "Value_Lower": -1.828,
        "Timestamp": "2019-05-08 23:00:00"
      },
      {
        "Value": -1.801,
        "Value_Upper": -1.233,
        "Value_Lower": -2.43,
        "Timestamp": "2019-05-09 00:00:00"
      },
      {
        "Value": -1.738,
        "Value_Upper": -1.138,
        "Value_Lower": -2.352,
        "Timestamp": "2019-05-09 01:00:00"
      },
      {
        "Value": -0.901,
        "Value_Upper": -0.285,
        "Value_Lower": -1.523,
        "Timestamp": "2019-05-09 02:00:00"
      },
      {
        "Value": 0.314,
        "Value_Upper": 0.967,
        "Value_Lower": -0.302,
        "Timestamp": "2019-05-09 03:00:00"
      },
      {
        "Value": 1.448,
        "Value_Upper": 2.054,
        "Value_Lower": 0.822,
        "Timestamp": "2019-05-09 04:00:00"
      },
      {
        "Value": 2.381,
        "Value_Upper": 2.982,
        "Value_Lower": 1.769,
        "Timestamp": "2019-05-09 05:00:00"
      },
      {
        "Value": 3.278,
        "Value_Upper": 3.861,
        "Value_Lower": 2.676,
        "Timestamp": "2019-05-09 06:00:00"
      },
      {
        "Value": 4.235,
        "Value_Upper": 4.828,
        "Value_Lower": 3.643,
        "Timestamp": "2019-05-09 07:00:00"
      },
      {
        "Value": 5.105,
        "Value_Upper": 5.696,
        "Value_Lower": 4.512,
        "Timestamp": "2019-05-09 08:00:00"
      },
      {
        "Value": 5.749,
        "Value_Upper": 6.386,
        "Value_Lower": 5.143,
        "Timestamp": "2019-05-09 09:00:00"
      },
      {
        "Value": 6.407,
        "Value_Upper": 7.015,
        "Value_Lower": 5.828,
        "Timestamp": "2019-05-09 10:00:00"
      },
      {
        "Value": 7.699,
        "Value_Upper": 8.283,
        "Value_Lower": 7.098,
        "Timestamp": "2019-05-09 11:00:00"
      },
      {
        "Value": 10.06,
        "Value_Upper": 10.657,
        "Value_Lower": 9.466,
        "Timestamp": "2019-05-09 12:00:00"
      },
      {
        "Value": 13.11,
        "Value_Upper": 13.707,
        "Value_Lower": 12.489,
        "Timestamp": "2019-05-09 13:00:00"
      },
      {
        "Value": 15.603,
        "Value_Upper": 16.161,
        "Value_Lower": 14.991,
        "Timestamp": "2019-05-09 14:00:00"
      },
      {
        "Value": 16.193,
        "Value_Upper": 16.78,
        "Value_Lower": 15.628,
        "Timestamp": "2019-05-09 15:00:00"
      },
      {
        "Value": 14.451,
        "Value_Upper": 15.068,
        "Value_Lower": 13.861,
        "Timestamp": "2019-05-09 16:00:00"
      },
      {
        "Value": 11.261,
        "Value_Upper": 11.873,
        "Value_Lower": 10.658,
        "Timestamp": "2019-05-09 17:00:00"
      },
      {
        "Value": 8.228,
        "Value_Upper": 8.823,
        "Value_Lower": 7.616,
        "Timestamp": "2019-05-09 18:00:00"
      },
      {
        "Value": 6.533,
        "Value_Upper": 7.135,
        "Value_Lower": 5.948,
        "Timestamp": "2019-05-09 19:00:00"
      },
      {
        "Value": 6.201,
        "Value_Upper": 6.794,
        "Value_Lower": 5.602,
        "Timestamp": "2019-05-09 20:00:00"
      },
      {
        "Value": 6.333,
        "Value_Upper": 6.975,
        "Value_Lower": 5.714,
        "Timestamp": "2019-05-09 21:00:00"
      },
      {
        "Value": 6.014,
        "Value_Upper": 6.581,
        "Value_Lower": 5.422,
        "Timestamp": "2019-05-09 22:00:00"
      },
      {
        "Value": 5.068,
        "Value_Upper": 5.648,
        "Value_Lower": 4.481,
        "Timestamp": "2019-05-09 23:00:00"
      },
      {
        "Value": 4.051,
        "Value_Upper": 4.636,
        "Value_Lower": 3.439,
        "Timestamp": "2019-05-10 00:00:00"
      },
      {
        "Value": 3.604,
        "Value_Upper": 4.191,
        "Value_Lower": 3.002,
        "Timestamp": "2019-05-10 01:00:00"
      },
      {
        "Value": 3.859,
        "Value_Upper": 4.453,
        "Value_Lower": 3.26,
        "Timestamp": "2019-05-10 02:00:00"
      },
      {
        "Value": 4.429,
        "Value_Upper": 5.002,
        "Value_Lower": 3.85,
        "Timestamp": "2019-05-10 03:00:00"
      },
      {
        "Value": 4.862,
        "Value_Upper": 5.476,
        "Value_Lower": 4.253,
        "Timestamp": "2019-05-10 04:00:00"
      },
      {
        "Value": 5.045,
        "Value_Upper": 5.656,
        "Value_Lower": 4.385,
        "Timestamp": "2019-05-10 05:00:00"
      },
      {
        "Value": 5.152,
        "Value_Upper": 5.734,
        "Value_Lower": 4.518,
        "Timestamp": "2019-05-10 06:00:00"
      },
      {
        "Value": 5.289,
        "Value_Upper": 5.894,
        "Value_Lower": 4.723,
        "Timestamp": "2019-05-10 07:00:00"
      },
      {
        "Value": 5.319,
        "Value_Upper": 5.943,
        "Value_Lower": 4.75,
        "Timestamp": "2019-05-10 08:00:00"
      },
      {
        "Value": 5.11,
        "Value_Upper": 5.704,
        "Value_Lower": 4.516,
        "Timestamp": "2019-05-10 09:00:00"
      },
      {
        "Value": 4.914,
        "Value_Upper": 5.528,
        "Value_Lower": 4.353,
        "Timestamp": "2019-05-10 10:00:00"
      },
      {
        "Value": 5.359,
        "Value_Upper": 5.951,
        "Value_Lower": 4.766,
        "Timestamp": "2019-05-10 11:00:00"
      },
      {
        "Value": 6.892,
        "Value_Upper": 7.506,
        "Value_Lower": 6.314,
        "Timestamp": "2019-05-10 12:00:00"
      }
    ]
  }
}
             */

            // ToDo :: handle the updated widget state here. Currently I'm not aware of the response format
          }
        }
      })
      .catch((err) => {
        this.setState({ error: err})
      })
  };

  render() {
    const { classes, i, type, name, description, isStatic, width, height, config, queryParams } = this.props;
    const { spec, loading, error, data } = this.state;

    if (!data) {
      return (
        <WidgetWrapper
          i={i}
          type={type}
          name={name}
          description={description}
          isStatic={isStatic}
          width={width}
          height={height}
          config={config}
          queryParams={queryParams}
        >
          <LoadingIndicator />
        </WidgetWrapper>
      )
    }

    return (
      <WidgetWrapper
        i={i}
        type={type}
        name={name}
        description={description}
        isStatic={isStatic}
        width={width}
        height={height}
        config={config}
        queryParams={queryParams}
      >
        <Fade in={!loading} mountOnEnter>
          <VegaLite
            className={classes.root}
            spec={spec}
            data={data}
            tooltip={this.tooltipHandler.call}
          />
        </Fade>
      </WidgetWrapper>
    )
  }
}

ForecastWidget = withStyles(styles, { withTheme: true })(ForecastWidget);

export default ForecastWidget