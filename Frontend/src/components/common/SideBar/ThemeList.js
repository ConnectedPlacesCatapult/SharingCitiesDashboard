import React, { Component } from 'react';
import PropTypes from "prop-types";
import List from '@material-ui/core/List';
import { connect } from 'react-redux';
import { fetchThemes, toggleThemeSelected } from "./../../../actions/themesActions";
import { fetchSources } from "./../../../actions/sourcesActions";
import _ from 'lodash';

import ThemeListItem from './ThemeListItem';

class ThemeList extends Component {
  componentWillMount() {
    this.props.fetchThemes();
    this.props.fetchSources();
  }

  render() {
    const { themes, selectedThemes, toggleThemeSelected, sources } = this.props;

    const themeListItems = themes.map((theme, i) => {
      return (
        <ThemeListItem
          key={i}
          themeId={i}
          themeName={theme}
          sources={sources.filter((source) => source.theme === theme)}
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
  sources: PropTypes.array.isRequired,
  toggleThemeSelected: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  themes: state.themes.themes,
  selectedThemes: state.themes.selected,
  sources: state.sources.sources,
});

const mapDispatchToProps = dispatch => ({
  fetchThemes: () => dispatch(fetchThemes()),
  toggleThemeSelected: id => dispatch(toggleThemeSelected(id)),
  fetchSources: () => dispatch(fetchSources()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ThemeList);
