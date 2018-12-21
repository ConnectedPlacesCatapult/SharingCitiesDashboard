import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import { connect } from 'react-redux';
import { fetchSubthemes, toggleSubthemeSelected } from "../../../actions/themesActions";

import SubthemeListItem from './SubthemeListItem';

class SubthemeList extends React.Component {
  constructor(props) {
    super(props);

    props.fetchSubthemes(props.themeId)
  }

  render() {
    const { themeId, themes, toggleSubthemeSelected } = this.props;

    const subthemes = themes.find(theme => theme.id === themeId).subthemes;
    const subthemeListItems = subthemes.map((subtheme, i) => {
      return (
        <SubthemeListItem
          key={i}
          themeId={themeId}
          subthemeId={subtheme.id}
          subthemeName={subtheme.name}
          isSelected={subtheme.isSelected}
          onClick={() => toggleSubthemeSelected(themeId, subtheme.id)}
        />
      )
    });

    return (
      <List component="nav" disablePadding>
        {subthemeListItems}
      </List>
    )
  }
}

SubthemeList.propTypes = {
  themeId: PropTypes.number.isRequired,
  themes: PropTypes.array.isRequired,
  fetchSubthemes: PropTypes.func.isRequired,
  toggleSubthemeSelected: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  themes: state.themes.themes,
});

const mapDispatchToProps = dispatch => ({
  fetchSubthemes: themeId => dispatch(fetchSubthemes(themeId)),
  toggleSubthemeSelected: (themeId, subthemeId) => dispatch(toggleSubthemeSelected(themeId, subthemeId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubthemeList)
