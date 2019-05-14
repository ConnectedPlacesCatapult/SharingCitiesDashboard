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
import { axiosInstance } from './../../api/axios';
import { getUserID } from './../../api/session';
import WidgetWrapper from './WidgetWrapper';

const styles = (theme) => ({
  root: {
    transition: 'all 0.2s ease',
    //width: 'auto',
    //height: '100%',
    //maxWidth: 0,
    //maxHeight: 0,
    overflow: 'hidden',
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
      error: null,
      loading: true,
      attributes: [],
    };

    this.eventSource = null;
  }

  componentDidMount() {
    this.getAllAttributes();
    this.connectToSSE();
  }

  componentWillUnmount() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  getAllAttributes = () => {
    this.setState({ loading: true });

    axiosInstance
      .get('/admin/attributes/get_attributes')
      .then((response) => {
        this.setState({
          attributes: response.data,
          loading: false,
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

  connectToSSE() {
    if (this.eventSource === null) {
      const apiUrl = `${process.env.NODE_HOST}${process.env.API_PORT}`;
      const path = '/alert/triggered';
      const userID = getUserID();
      const args = `?user_id=${userID}`;

      this.eventSource = new EventSource(`${apiUrl}${path}${args}`);
      this.eventSource.onerror = (err) => {
        console.log(err);
      };
      this.eventSource.onmessage = (e) => {
        console.log(e);

        // ToDo :: handle the updated widget state here. Currently I'm not aware of the response format
      }
    }
  };

  render() {
    const { classes, theme, i, type, name, description, isStatic, width, height, config, queryParams } = this.props;
    const { loading, error } = this.state;

    const tableStyles = {
      //width: `${width}px`,
      //height: `${height}px`,
    };

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
        config={config}
        queryParams={queryParams}
      >
        <Fade in={!loading} mountOnEnter>
          <Table className={classes.root} padding="none" style={tableStyles}>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">Attribute</TableCell>
                <TableCell className={classes.cellValue}>{getAttributeNameFromId(config.attributeId)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Minimum threshold</TableCell>
                <TableCell className={classes.cellValue}>{config.minThreshold}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Maximum threshold</TableCell>
                <TableCell className={classes.cellValue}>{config.maxThreshold}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Activated</TableCell>
                <TableCell className={classes.cellValue}>{config.activated.toString()}</TableCell>
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
