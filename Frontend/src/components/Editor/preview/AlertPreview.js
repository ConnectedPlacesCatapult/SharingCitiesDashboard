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
import { axiosInstance } from './../../../api/axios';
import { getUserID } from './../../../api/session';
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
      attributes: [],
      width: props.editor.widget.width,
      height: props.editor.widget.height,
    }
  }

  componentWillMount() {
    this.fetchData()
  }

  componentWillReceiveProps(nextProps) {
    const { editor } = this.props;

    if (nextProps.editor.themeTree !== editor.themeTree) {
      const attributes = nextProps.editor.themeTree.reduce((arr, theme) => {
        theme['sub_themes'].map((subtheme) => {
          subtheme.attributes.map((attribute) => {
            arr = [...arr, {
              id: attribute['id'],
              themeId: attribute['theme_id'],
              subthemeId: attribute['sub_theme_id'],
              name: attribute['name'],
              description: attribute['Description'],
              unit: attribute['Unit'],
              unitValue: attribute['Unit Value'],

            }];
          })
        });

        return arr
      }, []);

      this.setState({ attributes })
    }
  }

  componentDidUpdate(prevProps) {
    const { editor } = this.props;

    if (editor.widget.queryParams !== prevProps.editor.widget.queryParams) {
      this.fetchData()
    }
  }

  fetchDataOld() {
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

  fetchDataold2() {
    this.setState({ loading: true });

    const requestData = {
      user_id: getUserID(),
      //attribute_id:
    };

    axiosInstance
      .post('/alert/get_alerts', requestData)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  fetchData() {
    this.setState({ loading: true });

    const requestData = {
      user_id: getUserID(),
      //attribute_id:
    };

    axiosInstance
      .get('/alert/get_alerts', requestData)
      .then((response) => {
        console.log(response)

        this.setState({ loading: false })
      })
      .catch((error) => {
        console.log(error)
      })

    /*axios({
      url: FCC_CONFIG.apiRoot + '/alert/get_alerts',
      method: 'get',
      params: requestData,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err)
      })*/
  }

  getAttributeNameFromId = (attributeId) => {
    const { attributes } = this.state;

    const found = attributes.find((attribute) => attribute.id === attributeId);

    return found ? found.name : '';
  };

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
                <TableCell>{this.getAttributeNameFromId(editor.widget.config.attributeId)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Minimum threshold</TableCell>
                <TableCell>{editor.widget.config.minThreshold}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Maximum threshold</TableCell>
                <TableCell>{editor.widget.config.maxThreshold}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Activated</TableCell>
                <TableCell>{editor.widget.config.activated.toString()}</TableCell>
              </TableRow>

              {/*<TableRow>
                <TableCell component="th" scope="row">Type</TableCell>
                <TableCell>{editor.widget.queryParams.method}</TableCell>
              </TableRow>*/}

              {/*<TableRow>
                <TableCell component="th" scope="row">Value</TableCell>
                <TableCell align="right">{editor.widget.config.value}</TableCell>
              </TableRow>*/}

              {/*<TableRow>
                <TableCell component="th" scope="row">Current value</TableCell>
                <TableCell align="right">{data && data.length ? data[0]['Value'] : '?'}</TableCell>
              </TableRow>*/}

              {/*<TableRow>
                <TableCell component="th" scope="row">Email alert</TableCell>
                <TableCell >{editor.widget.config.sendEmail ? 'yes' : 'no'}</TableCell>
              </TableRow>*/}

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
