import React from 'react';
import PropTypes from 'prop-types';
import {
  Fade,
  withStyles,
} from '@material-ui/core';
import VegaLite from 'react-vega-lite';
import { Handler } from 'vega-tooltip';
import axios from 'axios';
import { axiosInstance } from './../../api/axios';
import WidgetWrapper from './WidgetWrapper';
import LoadingIndicator from './LoadingIndicator';

const FCC_CONFIG = require('./../../../fcc.config');

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

            // ToDo :: handle the updated widget state here. Currently I'm not aware of the response format
          }
        }
      })
      .catch((err) => {
        this.setState({ error: err})
      })
  };

  fetchStatus = () => {
    const { queryParams } = this.props;

    this.setState({ loading: true });

    axios({
      url: FCC_CONFIG.apiRoot + '/data',
      method: 'get',
      params: queryParams,
    })
      .then((response) => {
        this.setState({
          loading: false,
          data: {
            values: response.data,
          }
        })
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
