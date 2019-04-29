import React from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import {
  getThemeTree,
  setWidgetProperty,
  setWidgetConfigProperty,
  setWidgetQueryProperty
} from './../../../actions/editorActions';

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
    setWidgetProperty: PropTypes.func.isRequired,
    setWidgetConfigProperty: PropTypes.func.isRequired,
    setWidgetQueryProperty: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      attributes: [],
    };

    props.getThemeTree();
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

  setAlertProperty = (property) => (e) => {
    const { setWidgetProperty } = this.props;

    setWidgetProperty(property, e.target.value)
  };

  setAlertConfigProperty = (property) => (e) => {
    const { setWidgetConfigProperty } = this.props;

    setWidgetConfigProperty(property, e.target.value)
  };

  setAlertQueryProperty = (property, value) => {
    const { setWidgetQueryProperty } = this.props;

    setWidgetQueryProperty(property, value)
  };

  setAlertAttributeData = (e) => {
    this.setAlertQueryProperty('attributedata', e.target.value)
  };

  setAlertMethod = (e) => {
    this.setAlertQueryProperty('method', e.target.value)
  };

  render() {
    const { classes, editor } = this.props;
    const { attributes } = this.state;

    const attributeMenuItems = attributes.map((attribute, i) => <MenuItem key={i} value={attribute.name}>{attribute.name}</MenuItem>);

    return (
      <FormGroup className={classes.root}>
        <Divider className={classes.divider} />
        <FormControl className={classes.formControl} htmlFor="alert-attribute">
          <InputLabel htmlFor="alert-attribute">Attribute to track</InputLabel>
          <Select
            aria-label="Alert attribute"
            value={editor.widget.queryParams.attributedata}
            onChange={this.setAlertAttributeData}
            inputProps={{
              name: 'alertAttribute',
              id: 'alert-attribute',
            }}
          >
            {attributeMenuItems}
          </Select>
        </FormControl>
        <Divider className={classes.divider} />
        <FormControl className={classes.formControl}>
          <FormLabel>Alert type</FormLabel>
          <RadioGroup
            className={classes.group}
            aria-label="Alert type"
            value={editor.widget.queryParams.method}
            onChange={this.setAlertMethod}
            name='alertType'
          >
            <FormControlLabel
              value="min"
              control={<Radio />}
              label="min"
            />
            <FormControlLabel
              value="max"
              control={<Radio />}
              label="max"
            />
          </RadioGroup>
        </FormControl>
        <Divider className={classes.divider} />
        <FormControl htmlFor="alert-value">
          <TextField
            id="alert-value"
            label="Value"
            value={editor.widget.config.value}
            onChange={this.setAlertConfigProperty('value')}
            margin="normal"
          />
        </FormControl>
      </FormGroup>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  getThemeTree: () => dispatch(getThemeTree()),
  setWidgetProperty: () => (property, value) => dispatch(setWidgetProperty(property, value)),
  setWidgetConfigProperty: (property, value) => dispatch(setWidgetConfigProperty(property, value)),
  setWidgetQueryProperty: (property, value) => dispatch(setWidgetQueryProperty(property, value)),
});

AlertConfig = withStyles(styles)(AlertConfig);
AlertConfig = connect(mapStateToProps, mapDispatchToProps)(AlertConfig);

export default AlertConfig
