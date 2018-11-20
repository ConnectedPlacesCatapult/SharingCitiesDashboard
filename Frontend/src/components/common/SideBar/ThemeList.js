import React, { Component } from 'react';
import PropTypes from "prop-types";
import List from '@material-ui/core/List';
import { connect } from 'react-redux';
import { fetchThemes, toggleThemeSelected } from "./../../../actions/themesActions";
import _ from 'lodash';

import ThemeListItem from './ThemeListItem';

class ThemeList extends Component {
  constructor(props) {
    super(props);

    props.fetchThemes()
  }

  render() {
    const { themes, selectedThemes, toggleThemeSelected } = this.props;

    const themeListItems = themes.map((theme, i) => {
      return (
        <ThemeListItem
          key={i}
          themeId={i}
          themeName={theme}
          isSelected={_.indexOf(selectedThemes, i) !== -1}
          onClick={() => toggleThemeSelected(i)}
        />
      )
    });

    return (
      <List component="nav">
        {themeListItems}
      </List>
    )
  }
}

ThemeList.propTypes = {
  themes: PropTypes.array.isRequired,
  selectedThemes: PropTypes.array.isRequired,
  fetchThemes: PropTypes.func.isRequired,
  toggleThemeSelected: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  themes: state.themes.themes,
  selectedThemes: state.themes.selected,
});

const mapDispatchToProps = dispatch => {
  return {
    fetchThemes: () => dispatch(fetchThemes()),
    toggleThemeSelected: id => dispatch(toggleThemeSelected(id)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ThemeList)
