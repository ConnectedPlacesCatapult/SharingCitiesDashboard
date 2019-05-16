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
import ContainerDimensions from 'react-container-dimensions'

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
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired,
    isStatic: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    queryParams: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const { theme, config, width, height, w, h } = this.props;

    const titleTypography = theme.typography.body1;
    const labelTypography = theme.typography.body2;

    this.state = {
      loading: null,
      error: null,
      taskID: null,
      mape: 0,
      data: null,
      spec: {
        ...config.spec,
        width: 400,
        height: 200,
        w: w,
        h: h,
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
    //this.eventSource = null;
    this.timer = null;
  }

  componentWillMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    /*if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }*/

    this.killTimer()
  }

  killTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);

      this.timer = null;
    }
  };

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

        this.setState({
          loading: false,
          taskID: response.data[1]['task_id'],
          data: {
            values: formattedData,
          },
        });

        // set a timer to check status until it's "SUCCESS"
        this.timer = setInterval(this.checkPredictionStatus, 5000);

        // now connect to SSEs
        /*if (this.eventSource === null) {
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

              const formattedPredictions = e.result['Predictions'].map((record) => ({
                Attribute: `${queryParams.attributedata}-predicted`,
                Timestamp: record['Timestamp'],
                Value: record['Value'],
              }));

              this.setState(prevState => ({
                data: {
                  values: [...prevState.data.values, formattedPredictions],
                },
              }));
            }


            /!**
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
      *!/
          }
        }*/
      })
      .catch((err) => {
        this.setState({ error: err})
      })
  };

  checkPredictionStatus = () => {
    const { queryParams } = this.props;
    const { taskID } = this.state;

    axiosInstance
      .get('/pred_status', {
        params: {
          task_id: taskID,
        },
      })
      .then((response) => {
        if (response.data.state === "SUCCESS") {
          this.killTimer();

          const formattedPredictions = response.data.result['Predictions'].map((record) => ({
            Attribute: `${queryParams.attributedata}-predicted`,
            Timestamp: record['Timestamp'],
            Value: record['Value'],
          }));

          this.setState(prevState => ({
            mape: response.data.result['Mean_Absolute_Percentage_Error'],
            data: {
              values: [...prevState.data.values, ...formattedPredictions],
            },
          }));
        }
      })
      .catch((err) => {
        this.setState({ error: err})
      })
  };

  render() {
    const { classes, i, type, name, description, isStatic, width, height, config, queryParams, w, h } = this.props;
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
          w={w}
          h={h}
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
        w={w}
        h={h}
        config={config}
        queryParams={queryParams}
      >
        <Fade in={!loading} mountOnEnter>
          <ContainerDimensions>
            {({ width }) => {
              const responsiveSpec = { ...spec, width: Math.floor(width) }
              return <VegaLite
                className={classes.root}
                spec={responsiveSpec}
                data={data}
                tooltip={this.tooltipHandler.call}
              />
            }}
          </ContainerDimensions>
        </Fade>
      </WidgetWrapper>
    )
  }
}

ForecastWidget = withStyles(styles, { withTheme: true })(ForecastWidget);

export default ForecastWidget