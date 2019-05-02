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
import { connect } from 'react-redux';
import { setWidgetConfigProperty } from './../../../actions/editorActions';
import LoadingIndicator from './../../Widget/LoadingIndicator';

const FCC_CONFIG = require('./../../../../fcc.config');

const styles = (theme) => ({
  root: {
    transition: 'all 0.2s ease',
    width: 'auto',
    height: '100%',
    maxWidth: 0,
    maxHeight: 0,
    overflow: 'hidden',
  },
});

class AlertPreview extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
    setWidgetConfigProperty: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      data: null,
      error: null,
      loading: true,
      width: props.editor.widget.width,
      height: props.editor.widget.height,
    }
  }

  componentWillMount() {
    this.fetchData()
  }

  componentDidUpdate(prevProps) {
    const { editor } = this.props;

    if (editor.widget.queryParams !== prevProps.editor.widget.queryParams) {
      this.fetchData()
    }
  }

  fetchData() {
    const { editor } = this.props;

    this.setState({ loading: true });

    axios({
      url: FCC_CONFIG.apiRoot + '/data',
      method: 'get',
      params: editor.widget.queryParams,
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
    const { classes, editor } = this.props;
    const { data, error, loading } = this.state;

    if (loading) {
      return (
        <div className={classes.root}>
          <LoadingIndicator />
        </div>
      )
    }

    const rootStyles = {
      width: `${editor.widget.width}px`,
      height: `${editor.widget.height}px`,
      maxWidth: `${editor.widget.width}px`,
      maxHeight: `${editor.widget.height}px`,
    };

    return (
      <div className={classes.root} style={rootStyles}>
        <Fade in={!loading} mountOnEnter>
          <Table padding="none">
            <TableBody>

              <TableRow>
                <TableCell component="th" scope="row">Attribute</TableCell>
                <TableCell>{editor.widget.queryParams.attributedata}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Type</TableCell>
                <TableCell>{editor.widget.queryParams.method}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Value</TableCell>
                <TableCell align="right">{editor.widget.config.value}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Current value</TableCell>
                <TableCell align="right">{data && data.length ? data[0]['Value'] : '?'}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Email alert</TableCell>
                <TableCell >{editor.widget.config.sendEmail ? 'yes' : 'no'}</TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </Fade>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  setWidgetConfigProperty: (property, value) => dispatch(setWidgetConfigProperty(property, value)),
});

AlertPreview = withStyles(styles)(AlertPreview);
AlertPreview = connect(mapStateToProps, mapDispatchToProps)(AlertPreview);

export default AlertPreview
