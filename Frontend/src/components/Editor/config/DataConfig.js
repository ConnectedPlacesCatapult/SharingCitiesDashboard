import React from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  withStyles,
} from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';
import { connect } from 'react-redux';
import { getThemeTree, setWidgetQueryProperty } from './../../../actions/editorActions';

const STATIC_THEME_DATA = require('./../../../data/themes');
const STATIC_SUBTHEME_DATA = require('./../../../data/subthemes');
const STATIC_ATTRIBUTE_DATA = require('./../../../data/attributes');

const styles = (theme) => ({
  root: {
    flexDirection: 'column',
  },
});

class DataConfig extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
    setWidgetQueryProperty: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedThemes: [],
      selectedSubtheme: null,
      themeTree: props.editor.themeTree,
    };

    props.getThemeTree();
  }

  componentDidUpdate(nextProps) {
    const { editor } = this.props;

    if (nextProps.editor.themeTree !== editor.themeTree) {
      const attributesFromQueryParams = (editor.widget.queryParams && editor.widget.queryParams['attributedata']) ? editor.widget.queryParams['attributedata'].split(',') : [];

      let selectedThemes = [];
      let selectedSubtheme = null;

      // ToDo :: this needs to be finished
      for (let queryAttribute of attributesFromQueryParams) {
        const attr = STATIC_ATTRIBUTE_DATA.find(a => a.name === queryAttribute);

        selectedThemes = [...selectedThemes, attr.themeId];
        selectedSubtheme = attr.subthemeId;
      }

      this.setState({
        selectedThemes: [...new Set(selectedThemes)],
        selectedSubtheme,
      })
    }
  }

  handleThemeChange = (e) => {
    const themeId = Number(e.target.value);
    const checked = e.target.checked;

    this.setState((prevState) => ({
      selectedThemes: (!checked) ? prevState.selectedThemes.filter(id => id !== themeId) : [...prevState.selectedThemes, themeId],
    }))
  };

  handleSubthemeClick = (e, subthemeId) => {
    this.setState({ selectedSubtheme: subthemeId });

    const subthemeAttributes = STATIC_ATTRIBUTE_DATA.reduce((attributes, attribute) => {
      if (attribute.subthemeId === subthemeId) {
        attributes.push(attribute.name);
      }
      return attributes
    }, []);

    this.props.setWidgetQueryProperty('attributedata', subthemeAttributes.join())
  };

  render() {
    const { classes } = this.props;
    const { selectedThemes, selectedSubtheme } = this.state;

    const themeCheckboxes = STATIC_THEME_DATA.map((theme, i) => {
      return (
        <FormControlLabel
          key={i}
          label={theme.name}
          control={
            <Checkbox
              checked={selectedThemes.indexOf(theme.id) > -1}
              onChange={this.handleThemeChange}
              value={theme.id.toString()}
            />
          }
        />
      )
    });

    const getSubthemeListItems = () => {
      let subthemes = [];

      // if no theme is selected show all subthemes
      if (!selectedThemes.length) {
        subthemes = STATIC_SUBTHEME_DATA;

      // filter available subthemes based on selected theme(s)
      } else {
        subthemes = STATIC_SUBTHEME_DATA.filter((subtheme) => selectedThemes.includes(subtheme.themeId))
      }

      return subthemes.map((subtheme, i) => <ListItem
        key={i}
        button
        selected={selectedSubtheme === subtheme.id}
        onClick={(e) => this.handleSubthemeClick(e, subtheme.id)}
      >
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText>
          {subtheme.name}
        </ListItemText>
      </ListItem>)
    };

    return (
      <FormGroup className={classes.root}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Themes</FormLabel>
          <FormGroup>
            {themeCheckboxes}
          </FormGroup>
          <FormHelperText>Filter attributes by theme</FormHelperText>
        </FormControl>
        <Divider />
        <List
          component="nav"
          dense
        >
          {getSubthemeListItems()}
        </List>
      </FormGroup>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  getThemeTree: () => dispatch(getThemeTree()),
  setWidgetQueryProperty: (property, value) => dispatch(setWidgetQueryProperty(property, value)),
});

DataConfig = withStyles(styles)(DataConfig);
DataConfig = connect(mapStateToProps, mapDispatchToProps)(DataConfig);

export default DataConfig
