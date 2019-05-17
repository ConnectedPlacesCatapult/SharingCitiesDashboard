import React from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  FormControl,
  FormGroup,
  FormLabel,
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
  spacer: {
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
    const { editor } = this.props;

    if (editor.mode === "edit") {
      this.checkAlertStatus();
    }
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

  checkAlertStatus() {
    const { editor, setWidgetConfigProperty } = this.props;

    axiosInstance
      .get('alert/check_alerts', {
        params: {
          attribute_id: editor.widget.config.attributeId,
          user_id: getUserID(),
        },
      })
      .then((response) => {
        if (response.data[editor.widget.config.type].length) {
          const triggeredAlert = response.data[editor.widget.config.type].find((alert) => alert.id === editor.widget.config.alertId);

          if (triggeredAlert) {
            const triggerEvent = {
              ...editor.widget.config.triggerEvent,
              message: triggeredAlert['type'],
              value: triggeredAlert['value'],
              timestamp: triggeredAlert['timestamp'],
            };

            setWidgetConfigProperty("triggered", true);
            setWidgetConfigProperty("triggerEvent", triggerEvent);
          }
        }
      })
      .catch((err) => {
        this.setState({ error: err.response })
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

    // ToDo :: need to add "reset alert" functionality
    return (
      <FormGroup className={classes.root}>
        <Divider className={classes.spacer} />
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
        <Divider className={classes.spacer} />
        <FormLabel>Type</FormLabel>
        <FormControl htmlFor="alert-type">
          <Select
            label="type"
            value={editor.widget.config.type}
            onChange={this.setAlertConfigProperty('type')}
            inputProps={{
              name: 'alertType',
              id: 'alert-type',
            }}
          >
            <MenuItem value="max">Maximum threshold</MenuItem>
            <MenuItem value="min">Minimum threshold</MenuItem>
          </Select>
        </FormControl>
        <Divider className={classes.spacer} />
        <TextField
          label="Threshold value"
          value={editor.widget.config.value}
          onChange={this.setAlertConfigProperty('value')}
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
