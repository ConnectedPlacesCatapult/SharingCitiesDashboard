import React, { Component } from 'react';
import PropTypes from "prop-types";
import List from '@material-ui/core/List';
import { connect } from 'react-redux';
import { fetchThemes } from "./../../../actions/themesActions";
import { fetchSources } from "./../../../actions/sourcesActions";

import ThemeListItem from './ThemeListItem';

class ThemeList extends Component {
  componentWillMount() {
    this.props.fetchThemes();
    this.props.fetchSources();
  }

  render() {
    const { themes, sources } = this.props;

    const themeListItems = themes.map((theme, i) => {
      return <ThemeListItem key={i} name={theme} sources={sources.filter((source) => source.theme === theme)} />
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
  sources: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  return {
    themes: state.themes.themes,
    sources: state.sources.sources,
  }
};

const mapDispatchToProps = {
  fetchThemes,
  fetchSources,
};

export default connect(mapStateToProps, mapDispatchToProps)(ThemeList);
