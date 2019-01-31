import React from 'react';
import PropTypes from "prop-types";

import ThemeListItem from './ThemeListItem';

// material-ui
import List from '@material-ui/core/List';

// redux
import { connect } from 'react-redux';
import { fetchThemes, toggleThemeSelected } from "./../../../actions/themesActions";

class ThemeList extends React.Component {
  constructor(props) {
    super(props);

    if (!props.themes.length) {
      props.fetchThemes()
    }
  }

  render() {
    const { themes, toggleThemeSelected } = this.props;

    const themeListItems = themes.map((theme, i) => {
      return (
        <ThemeListItem
          key={i}
          themeId={theme.id}
          themeName={theme.name}
          isSelected={theme.isSelected}
          onClick={() => toggleThemeSelected(theme.id)}
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
  fetchThemes: PropTypes.func.isRequired,
  toggleThemeSelected: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  themes: state.themes.themes,
});

const mapDispatchToProps = (dispatch) => ({
  fetchThemes: () => dispatch(fetchThemes()),
  toggleThemeSelected: (id) => dispatch(toggleThemeSelected(id)),
});

ThemeList = connect(mapStateToProps, mapDispatchToProps)(ThemeList);

export default ThemeList
