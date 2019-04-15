import React from 'react';
import PropTypes from 'prop-types';

import SubthemeListItem from './SubthemeListItem';

// material-ui
import List from '@material-ui/core/List';

// redux
import { connect } from 'react-redux';
import {
  fetchSubthemes,
  toggleSubthemeSelected
} from "../../../actions/dataTableActions";

class SubthemeList extends React.Component {
  constructor(props) {
    super(props);

    if (!props.themes.find(theme => theme.id === props.themeId).subthemes.length) {
      props.fetchSubthemes(props.themeId)
    }
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

const mapStateToProps = (state) => ({
  themes: state.dataTable.themes,
});

const mapDispatchToProps = (dispatch) => ({
  fetchSubthemes: (themeId) => dispatch(fetchSubthemes(themeId)),
  toggleSubthemeSelected: (themeId, subthemeId) => dispatch(toggleSubthemeSelected(themeId, subthemeId)),
});

SubthemeList = connect(mapStateToProps, mapDispatchToProps)(SubthemeList);

export default SubthemeList
