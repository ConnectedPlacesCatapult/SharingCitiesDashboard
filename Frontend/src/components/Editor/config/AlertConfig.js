import React from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import {
  getThemeTree,
  setWidgetConfigProperty,
} from './../../../actions/editorActions';
import { axiosInstance } from './../../../api/axios';
import { getUserID } from './../../../api/session';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  divider: {
    margin: `${theme.spacing.unit}px 0`,
  },
  formControl: {

  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class AlertConfig extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    getThemeTree: PropTypes.func.isRequired,
    setWidgetConfigProperty: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      alert: null,
      attributes: [],
    };

    props.getThemeTree();
  }

  componentWillMount() {
    this.fetchAlert()
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

  fetchAlert() {
    const { editor } = this.props;

    editor.fetching = true;

    const requestData = {
      user_id: getUserID(),
      attribute_id: editor.widget.config.attributeId,
      widget_id: editor.widget.i,
    };

    axiosInstance
      .get('/alert/get_alerts', { params: requestData })
      .then((response) => {
        editor.fetching = false;

        // check for differences between widget alert and actual alert
        // update editor.widget.config if so
        if (response.data[0].attribute_id !== editor.widget.config.attributeId) {
          editor.widget.config.attributeId = response.data[0].attribute_id
        }

        if (response.data[0].min_threshold.toString() !== editor.widget.config.minThreshold.toString()) {
          editor.widget.config.minThreshold = response.data[0].min_threshold
        }

        if (response.data[0].max_threshold.toString() !== editor.widget.config.maxThreshold.toString()) {
          editor.widget.config.maxThreshold = response.data[0].max_threshold
        }

        if (response.data[0].activated.toString() !== editor.widget.config.activated.toString()) {
          editor.widget.config.activated = response.data[0].activated
        }

        this.setState({
          alert: response.data[0],
        })
      })
      .catch((error) => {
        this.setState({ error})
      })
  }

  setAlertConfigProperty = (property) => (e) => {
    const { setWidgetConfigProperty } = this.props;

    setWidgetConfigProperty(property, e.target.value)
  };

  render() {
    const { classes, editor } = this.props;
    const { attributes } = this.state;

    const attributeMenuItems = attributes.map((attribute, i) => <MenuItem key={i} value={attribute.id}>{attribute.name}</MenuItem>);

    return (
      <FormGroup className={classes.root}>

        <Divider className={classes.divider} />

        <FormControl className={classes.formControl} htmlFor="alert-attribute">
          <InputLabel htmlFor="alert-attribute">Attribute to track</InputLabel>
          <Select
            aria-label="Alert attribute"
            value={editor.widget.config.attributeId ? editor.widget.config.attributeId : ''}
            onChange={this.setAlertConfigProperty('attributeId')}
            inputProps={{
              name: 'alertAttribute',
              id: 'alert-attribute',
            }}
          >
            {attributeMenuItems}
          </Select>
        </FormControl>

        <Divider className={classes.divider} />

        <TextField
          label="Minimum threshold"
          value={editor.widget.config.minThreshold ? editor.widget.config.minThreshold: ''}
          onChange={this.setAlertConfigProperty('minThreshold')}
          margin="normal"
        />

        <Divider className={classes.divider} />

        <TextField
          label="Maximum threshold"
          value={editor.widget.config.maxThreshold ? editor.widget.config.maxThreshold: ''}
          onChange={this.setAlertConfigProperty('maxThreshold')}
          margin="normal"
        />
      </FormGroup>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  getThemeTree: () => dispatch(getThemeTree()),
  setWidgetConfigProperty: (property, value) => dispatch(setWidgetConfigProperty(property, value)),
});

AlertConfig = withStyles(styles)(AlertConfig);
AlertConfig = connect(mapStateToProps, mapDispatchToProps)(AlertConfig);

export default AlertConfig
