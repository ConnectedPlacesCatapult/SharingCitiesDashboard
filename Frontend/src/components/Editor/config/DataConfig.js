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
  ListSubheader,
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
  listHeightLimit: {
    maxHeight: `${theme.spacing.unit * 30}px`,
    overflowY: 'auto',
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
      selectedAttributes: [],
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
      let selectedAttributes = [];

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

        selectedThemes = [...selectedThemes, attr['theme_id']];
        selectedSubtheme = attr['sub_theme_id'];
        selectedAttributes = [...selectedAttributes, queryAttribute]
      }

      this.setState({
        selectedThemes: [...new Set(selectedThemes)],
        selectedSubtheme,
        selectedAttributes,
        allSubthemes,
        allAttributes,
      })
    }
  }

  handleThemeChange = (e) => {
    const { selectedThemes, selectedSubtheme, selectedAttributes, allSubthemes, allAttributes } = this.state;

    const themeId = Number(e.target.value);
    const alreadySelected = (!e.target.checked);
    const newSelectedThemes = (alreadySelected) ? selectedThemes.filter(id => id !== themeId) : [...selectedThemes, themeId];
    let newSelectedSubtheme = selectedSubtheme;
    let newSelectedAttributes = selectedAttributes;

    // if this theme wasn't already selected...
    if (!alreadySelected) {

      // ... and if there is already a subtheme selected
      // make sure the selectedSubtheme is a child of one of the selected themes now
      if (selectedSubtheme) {
        const selectedSubthemeThemeId = allSubthemes.find((subtheme) => subtheme['id'] === selectedSubtheme)['Theme id'];

        if (newSelectedThemes.indexOf(selectedSubthemeThemeId) === -1) {
          newSelectedSubtheme = null;
        }
      }

      // ... now if there are already attributes selected
      // make sure the selected attributes are grandchildren of one of the selected themes now
      if (selectedAttributes.length) {
        newSelectedAttributes = selectedAttributes.filter((attributeName) => {
          const attributeThemeId = allAttributes.find((attr) => attr['name'] === attributeName)['theme_id'];

          return newSelectedThemes.includes(attributeThemeId)
        })
      }
    }

    this.setState({
      selectedThemes: newSelectedThemes,
      selectedSubtheme: newSelectedSubtheme,
      selectedAttributes: newSelectedAttributes,
    }, this.setQueryParams)
  };

  handleSubthemeClick = (e, subthemeId) => {
    const { selectedSubtheme, selectedAttributes, allAttributes } = this.state;

    const alreadySelected = (subthemeId === selectedSubtheme);
    let newSelectedAttributes = selectedAttributes;

    // if this subtheme wasn't already selected...
    if (!alreadySelected) {

      // ... and if there are already attributes selected
      if (selectedAttributes.length) {

        // make sure the selected attributes are children of the selected subthemes
        newSelectedAttributes = selectedAttributes.filter((attributeName) => {
          const attributeSubthemeId = allAttributes.find((attr) => attr['name'] === attributeName)['sub_theme_id'];

          return attributeSubthemeId === subthemeId
        })
      }
    }

    this.setState({
      selectedSubtheme: (alreadySelected) ? null : subthemeId,
      selectedAttributes: newSelectedAttributes,
    }, this.setQueryParams)
  };

  handleAttributeClick = (e, attributeName) => {
    const { selectedAttributes } = this.state;

    this.setState((prevState) => ({
      selectedAttributes: (selectedAttributes.indexOf(attributeName) > -1) ? prevState.selectedAttributes.filter(name => name !== attributeName) : [...prevState.selectedAttributes, attributeName],
    }), this.setQueryParams);
  };

  setQueryParams = () => {
    const { selectedAttributes } = this.state;
    const { setWidgetQueryProperty } = this.props;

    setWidgetQueryProperty('attributedata', selectedAttributes.join())
  };

  render() {
    const { classes, editor } = this.props;
    const { selectedThemes, selectedSubtheme, selectedAttributes, allSubthemes, allAttributes } = this.state;

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
      let possibleSubthemes = allSubthemes;

      // if any themes are selected filter the possible subthemes based on the selected themes
      if (selectedThemes.length) {
        possibleSubthemes = allSubthemes.filter((subtheme) => selectedThemes.includes(subtheme['Theme id']))
      }

      return possibleSubthemes.map((subtheme, i) => <ListItem
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

    const getAttributeListItems = () => {
      let possibleAttributes = allAttributes;

      // if any themes are selected filter the possible attributes based on the selected themes
      if (selectedThemes.length) {
        possibleAttributes = possibleAttributes.filter((attr) => selectedThemes.includes(attr['theme_id']))
      }

      // if a subtheme is selected filter the possible attributes based on the selected subtheme
      if (selectedSubtheme) {
        possibleAttributes = possibleAttributes.filter((attr) =>  attr['sub_theme_id'] === selectedSubtheme)
      }

      return possibleAttributes.map((attribute, i) => <ListItem
        key={i}
        button
        selected={selectedAttributes.indexOf(attribute['name']) > -1}
        onClick={(e) => this.handleAttributeClick(e, attribute['name'])}
      >
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText>
          {attribute['name']}
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
          className={classes.listHeightLimit}
          component="nav"
          dense
        >
          <ListSubheader>Filter attributes by subtheme</ListSubheader>
          {getSubthemeListItems()}
        </List>
        <Divider />
        <List
          className={classes.listHeightLimit}
          component="nav"
          dense
        >
          <ListSubheader>Available attributes</ListSubheader>
          {getAttributeListItems()}
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
