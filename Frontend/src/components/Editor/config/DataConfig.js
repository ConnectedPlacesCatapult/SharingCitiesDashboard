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

const styles = (theme) => ({
  root: {
    flexDirection: 'column',
  },
  spacer: {
    margin: `${theme.spacing.unit}px 0`,
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
      allSubthemes: [],
      allAttributes: [],
    };

    props.getThemeTree();
  }

  componentDidUpdate(nextProps) {
    const { editor } = this.props;

    if (nextProps.editor.themeTree !== editor.themeTree) {
      const attributesFromQueryParams = (editor.widget.queryParams && editor.widget.queryParams['attributedata']) ? editor.widget.queryParams['attributedata'].split(',') : [];

      let selectedThemes = [];
      let selectedSubtheme = null;

      let allSubthemes = [];
      let allAttributes = [];

      for (let theme of editor.themeTree) {
        if (theme['sub_themes']) {
          for (let subtheme of theme['sub_themes']) {
            allSubthemes = [...allSubthemes, subtheme];

            if (subtheme.attributes) {
              for (let attribute of subtheme.attributes) {
                allAttributes = [...allAttributes, attribute]
              }
            }
          }
        }
      }

      for (let queryAttribute of attributesFromQueryParams) {
        const attr = allAttributes.find(a => a.name === queryAttribute);

        selectedThemes = [...selectedThemes, attr.theme_id];
        selectedSubtheme = attr.sub_theme_id;
      }

      this.setState({
        selectedThemes: [...new Set(selectedThemes)],
        selectedSubtheme,
        allSubthemes,
        allAttributes,
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

    const subthemeAttributes = this.state.allAttributes.reduce((attributes, attribute) => {
      if (attribute['sub_theme_id'] === subthemeId) {
        attributes.push(attribute['name']);
      }
      return attributes
    }, []);

    this.props.setWidgetQueryProperty('attributedata', subthemeAttributes.join())
  };

  render() {
    const { classes, editor } = this.props;
    const { selectedThemes, selectedSubtheme, allSubthemes } = this.state;

    const themeCheckboxes = editor.themeTree.map((theme, i) => {
      return (
        <FormControlLabel
          key={i}
          label={theme['Name']}
          control={
            <Checkbox
              checked={selectedThemes.indexOf(theme.id) > -1}
              onChange={this.handleThemeChange}
              value={theme['id'].toString()}
            />
          }
        />
      )
    });

    const getSubthemeListItems = () => {
      let subthemes = [];

      // if no theme is selected show all subthemes
      if (!selectedThemes.length) {
        subthemes = allSubthemes;

      // filter available subthemes based on selected theme(s)
      } else {
        subthemes = allSubthemes.filter((subtheme) => selectedThemes.includes(subtheme['Theme id']))
      }

      return subthemes.map((subtheme, i) => <ListItem
        key={i}
        button
        selected={selectedSubtheme === subtheme['id']}
        onClick={(e) => this.handleSubthemeClick(e, subtheme['id'])}
      >
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText>
          {subtheme['Name']}
        </ListItemText>
      </ListItem>)
    };

    return (
      <FormGroup className={classes.root}>
        <Divider className={classes.spacer} />
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
