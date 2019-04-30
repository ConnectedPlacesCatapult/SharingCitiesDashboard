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
import axios from 'axios';
import WidgetWrapper from './WidgetWrapper';
import LoadingIndicator from './LoadingIndicator';

const FCC_CONFIG = require('./../../../fcc.config');

const styles = (theme) => ({
  root: {
    display: 'table',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'inherit',
    width: 'inherit',
    //marginTop: -theme.spacing.unit * 3,
  },
  cellValue: {
    color: theme.palette.primary.main,
    textAlign: 'right',
  },
});

class AlertWidget extends React.Component {
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

    this.state = {
      loading: false,
      error: null,
      data: null,
    }
  }

  componentWillMount() {
    this.fetchData()
  }

  fetchData() {
    const { queryParams } = this.props;

    this.setState({ loading: true });

    axios({
      url: FCC_CONFIG.apiRoot + '/data',
      method: 'get',
      params: queryParams,
    })
      .then((response) => {
        if (response.data.length) {
          this.setState({
            loading: false,
            data: response.data[0]['Attribute_Values'],
          })
        } else {
          this.setState({
            loading: false,
          })
        }
      })
      .catch((err) => {
        this.setState({ error: err})
      })
  }

  render() {
    const { classes, theme, i, type, name, description, isStatic, width, height, config, queryParams } = this.props;
    const { loading, error, data } = this.state;

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

    const tableStyles = {
      width: `${width}px`,
      height: `${height}px`,
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
        config={config}
        queryParams={queryParams}
      >
        <Fade in={!loading} mountOnEnter>
          <Table padding="none" className={classes.root} style={tableStyles}>
            <TableBody>

              <TableRow>
                <TableCell component="th" scope="row">Attribute</TableCell>
                <TableCell className={classes.cellValue}>{queryParams.attributedata}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Type</TableCell>
                <TableCell className={classes.cellValue}>{queryParams.method}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Value</TableCell>
                <TableCell align="right" className={classes.cellValue}>{config.value}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Current value</TableCell>
                <TableCell align="right" className={classes.cellValue}>{data && data.length ? data[0]['Value'] : '?'}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Email alert</TableCell>
                <TableCell className={classes.cellValue}>{config.sendEmail ? 'yes' : 'no'}</TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </Fade>
      </WidgetWrapper>
    )
  }
}



AlertWidget = withStyles(styles, { withTheme: true })(AlertWidget);

export default AlertWidget
