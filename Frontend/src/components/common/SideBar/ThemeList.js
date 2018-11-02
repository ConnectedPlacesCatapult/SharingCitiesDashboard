import React, { Component } from 'react';
import List from '@material-ui/core/List';
import { connect } from 'react-redux';
import { fetchThemes } from "./../../../actions/themesActions";

import ThemeListItem from './ThemeListItem';

class ThemeList extends Component {
  componentWillMount() {
    this.props.fetchThemes();
  }

  render() {
    const { themes } = this.props;

    const themeListItems = themes.map((theme, i) => {
      return <ThemeListItem key={i} {...theme} />
    });

    return (
      <List component="nav">
        {themeListItems}
      </List>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    themes: state.themes.themes,
  }
};

const mapDispatchToProps = {
  fetchThemes,
};

export default connect(mapStateToProps, mapDispatchToProps)(ThemeList);
