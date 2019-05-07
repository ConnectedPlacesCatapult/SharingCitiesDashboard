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
  Switch,
  TextField,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import {
  getThemeTree,
  setWidgetConfigProperty,
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
    setWidgetConfigProperty: PropTypes.func.isRequired,
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

  setAlertConfigProperty = (property) => (e) => {
    const { setWidgetConfigProperty } = this.props;

    setWidgetConfigProperty(property, e.target.value)
  };

  handleChange = (name) => (e) => {
    console.log(name, e.target.checked)
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
