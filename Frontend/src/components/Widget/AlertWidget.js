import React from 'react';
import PropTypes from 'prop-types';
import {
  Fade,
  Table,
  TableBody,
  TableCell,
  TableRow,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { saveWidget } from './../../actions/editorActions';
import { axiosInstance } from './../../api/axios';
import { getUserID } from './../../api/session';
import WidgetWrapper from './WidgetWrapper';

const styles = (theme) => ({
  root: {
    transition: 'all 0.2s ease',
    overflow: 'hidden',
  },
  cellValue: {
    color: theme.palette.primary.main,
    textAlign: 'right',
  },
  cellTriggered: {
    color: theme.palette.secondary.main,
    textAlign: 'right',
  },
});

class AlertWidget extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
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

    this.state = {
      error: null,
      loading: true,
      attributes: [],
    };

    this.intervalTimer = null;
  }

  componentDidMount() {
    this.getAllAttributes();
  }

  componentWillUnmount() {
    this.killTimer(this.intervalTimer)
  }

  killTimer = (timer) => {
    if (timer) {
      clearInterval(timer);

      timer = null;
    }
  };

  getAllAttributes = () => {
    const { config } = this.props;

    this.setState({ loading: true });

    axiosInstance
      .get('/admin/attributes/get_attributes')
      .then((response) => {
        this.setState({
          attributes: response.data,
          loading: false,
        }, () => {

          // no need to check status if alert is already triggered
          if (config.triggered.toString() === "false") {
            this.intervalTimer = setInterval(this.checkAlertStatus, 10000);

            this.checkAlertStatus()
          }
        })
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error,
        })
      })
    ;
  };

  checkAlertStatus = () => {
    const { i, type, name, description, isStatic, width, height, w, h, config, queryParams, saveWidget } = this.props;

    axiosInstance
      .get('/alert/check_alerts', {
        params: {
          attribute_id: config.attributeId,
          user_id: getUserID(),
        }
      })
      .then((response) => {
        if (response.data[config.type].length) {
          const triggeredAlert = response.data[config.type].find((alert) => alert.id === config.alertId);

          if (triggeredAlert) {

            // kill the timer
            this.killTimer(this.intervalTimer);

            // rebuild a widget object with the updated alert info
            const widget = {
              type,
              name,
              description,
              width,
              height,
              w,
              h,
              isStatic,
              config: {
                ...config,
                triggered: true,
                triggerEvent: {
                  ...config.triggerEvent,
                  message: triggeredAlert['type'],
                  value: triggeredAlert['value'],
                  timestamp: triggeredAlert['timestamp'],
                }
              },
              queryParams,
              i,
            };

            // get the editor to save it in "edit" mode
            saveWidget('edit', widget)
          }
        }
      })
      .catch((err) => {
        this.setState({ error: err.response })
      })
  };

  render() {
    const { classes, i, type, name, description, isStatic, width, height, w, h, config, queryParams } = this.props;
    const { loading } = this.state;

    const getAttributeNameFromId = (attributeId) => {
      const { attributes } = this.state;

      const found = attributes.find((attribute) => attribute.id === attributeId);

      return found ? found.name : '';
    };

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
          <Table className={classes.root} padding="none">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">Watched attribute</TableCell>
                <TableCell className={classes.cellValue}>{getAttributeNameFromId(config.attributeId)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Alert type</TableCell>
                <TableCell className={classes.cellValue}>{config.type} threshold</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Threshold value</TableCell>
                <TableCell className={classes.cellValue}>{config.value}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Status</TableCell>
                {config.triggered.toString() === 'true'
                  ? <TableCell className={classes.cellTriggered}>{config.triggerEvent.message}<br />at {config.triggerEvent.timestamp}</TableCell>
                  : <TableCell className={classes.cellValue}>alert active</TableCell>
                }
            </TableRow>
            </TableBody>
          </Table>
        </Fade>
      </WidgetWrapper>
    )
  }
}

const mapDispatchToProps  = (dispatch) => ({
  saveWidget: (mode, widget) => dispatch(saveWidget(mode, widget)),
});

AlertWidget = withStyles(styles)(AlertWidget);
AlertWidget = connect(null, mapDispatchToProps)(AlertWidget);

export default AlertWidget
