import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  withStyles,
} from '@material-ui/core';
import VegaLite from 'react-vega-lite';
import { Handler } from 'vega-tooltip';
import { axiosInstance } from './../../api/axios';
import WidgetWrapper from './WidgetWrapper';
import ForecastStatus from './ForecastStatus';
import {
  MAPE_RATING_BAD,
  MAPE_RATING_FAIR,
  MAPE_RATING_GOOD,
} from './../../constants';
import LoadingIndicator from './LoadingIndicator';
import ContainerDimensions from 'react-container-dimensions'

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 'inherit',
    width: 'inherit',
  },
  mape: {
    margin: theme.spacing.unit * 2,
  },
  mapeValue: {
    color: theme.palette.primary.main,
  },
  mapeRating: {

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
      loadState: "LOADING",
      loadStatus: "initializing widget",
      error: null,
      taskID: null,
      mape: "unknown",
      mapeRating: "unknown",
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

    this.intervalTimer = null;
    this.timeoutTimer = null;
  }

  componentWillMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    this.killTimer(this.intervalTimer)
    this.killTimer(this.timeoutTimer)
  }

  killTimer = (timer) => {
    if (timer) {
      clearInterval(timer);
      clearTimeout(timer);

      timer = null;
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
          //loading: false,
          taskID: response.data[1]['task_id'],
          loadStatus: "checking for prediction",
          data: {
            values: formattedData,
          },
        });

        // set a timer to check status until it's "SUCCESS"
        this.intervalTimer = setInterval(this.checkPredictionStatus, 5000);

        // also check status right away
        this.checkPredictionStatus();
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
        switch (response.data.state) {
          case "PROGRESS":
            this.setState({
              loadState: "WORKING",
              loadStatus: response.data.status,
            });

            break;

          case "SUCCESS":
            this.killTimer(this.intervalTimer);

            const formattedPredictions = response.data.result['Predictions'].map((record) => ({
              Attribute: `${queryParams.attributedata}-predicted`,
              Timestamp: record['Timestamp'],
              Value: record['Value'],
            }));

            this.setState(prevState => ({
              loadState: response.data.state,
              loadStatus: "prediction completed",
              mape: response.data.result['Mean_Absolute_Percentage_Error'],
              mapeRating: this.getMAPERating(response.data.result['Mean_Absolute_Percentage_Error']),
              data: {
                values: [...prevState.data.values, ...formattedPredictions],
              },
            }), () => {
              this.timeoutTimer = setTimeout(() => {
                this.setState({ loading: false })
              }, 3000)
            });

            break
        }
      })
      .catch((err) => {
        this.killTimer(this.intervalTimer);

        this.setState({
          loadState: "ERROR",
          loadStatus: err.response.data.status,
          error: err,
        })
      })
  };

  getMAPERating = (mape) => {
    if (mape < 50) return MAPE_RATING_GOOD;
    if (mape <= 100) return MAPE_RATING_FAIR;

    return MAPE_RATING_BAD
  };

  render() {
    const { classes, i, type, name, description, isStatic, width, height, config, queryParams, w, h } = this.props;
    const { spec, loading, data, loadState, loadStatus } = this.state;

    if (loading) {
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
          <ForecastStatus loadState={loadState} loadStatus={loadStatus} />
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
        <div className={classes.root}>
          {/*<div>*/}
            <Typography variant="body2" className={classes.mape}>
              M.A.P.E.:
              <span className={classes.mapeValue}> {this.state.mape.toFixed(3)}</span>
              <span className={classes.mapeRating}> ({this.state.mapeRating})</span>
            </Typography>
            <ContainerDimensions>
            {({ width, height }) => {
              const responsiveSpec = { ...spec, width: Math.floor(width), height: Math.floor(height) - 100 }
              return <VegaLite
                className={classes.root}
                spec={responsiveSpec}
                data={data}
                tooltip={this.tooltipHandler.call}
              />
            }}
          </ContainerDimensions>
          {/*</div>*/}
        </div>
      </WidgetWrapper>
    )
  }
}

ForecastWidget = withStyles(styles, { withTheme: true })(ForecastWidget);

export default ForecastWidget