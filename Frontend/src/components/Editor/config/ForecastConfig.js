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
  setWidgetQueryProperty
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

class ForecastConfig extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    getThemeTree: PropTypes.func.isRequired,
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
    const { editor} = this.props;
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

  componentDidMount () {
    // Set User ID
    const { user, setWidgetQueryProperty } = this.props;
    setWidgetQueryProperty('user_id', user.user.id)
  }

  setForecastConfigProperty = (property) => (e) => {
    const { setWidgetConfigProperty } = this.props;
    setWidgetConfigProperty(property, e.target.value)
  };

  setForecastQueryProperty = (property) => (e) => {
    const { setWidgetQueryProperty } = this.props;
    setWidgetQueryProperty(property, e.target.value)
  };

  render() {
    const { classes, editor } = this.props;
    const { attributes } = this.state;

    const attributeMenuItems = attributes.map((attribute, i) => <MenuItem key={i} value={attribute.name}>{attribute.name}</MenuItem>);

    return (
      <FormGroup className={classes.root}>

        <Divider className={classes.divider} />

        <FormControl className={classes.formControl} htmlFor="forecast-attribute">
          <InputLabel htmlFor="forecast-attribute">Attribute to track</InputLabel>
          <Select
            aria-label="Forecast attribute"
            value={editor.widget.queryParams.attributedata ? editor.widget.queryParams.attributedata : ''}
            onChange={this.setForecastQueryProperty('attributedata')}
            inputProps={{
              name: 'forecastAttribute',
              id: 'forecast-attribute',
            }}
          >
            {attributeMenuItems}
          </Select>
        </FormControl>

        <Divider className={classes.divider} />

        <TextField
          label="Number of Predictions"
          value={editor.widget.queryParams.n_predictions ? editor.widget.queryParams.n_predictions: ''}
          onChange={this.setForecastQueryProperty('n_predictions')}
          margin="normal"
        />

      </FormGroup>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  getThemeTree: () => dispatch(getThemeTree()),
  setWidgetConfigProperty: (property, value) => dispatch(setWidgetConfigProperty(property, value)),
  setWidgetQueryProperty: (property, value) => dispatch(setWidgetQueryProperty(property, value)),
});

ForecastConfig = withStyles(styles)(ForecastConfig);
ForecastConfig = connect(mapStateToProps, mapDispatchToProps)(ForecastConfig);

export default ForecastConfig
