import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import { connect } from 'react-redux';
import { fetchSubthemes, toggleSubthemeSelected } from "../../../actions/subthemesActions";
import _ from "lodash";

import SubthemeListItem from './SubthemeListItem';

class SubthemeList extends React.Component {
  constructor(props) {
    super(props);

    props.fetchSubthemes(props.themeName)
  }

  render() {
    const { themeId, themeName, subthemes, selectedSubthemes, toggleSubthemeSelected } = this.props;

    const subthemeListItems = subthemes.filter(subtheme => subtheme.theme === themeName).map((subtheme, i) => {
      const subthemeId = themeId + "_" + i;

      return (
        <SubthemeListItem
          key={i}
          subthemeId={subthemeId}
          subthemeName={subtheme.name}
          subthemeMeta={subtheme.meta}
          themeName={themeName}
          isSelected={_.indexOf(selectedSubthemes, subthemeId) !== -1}
          onClick={() => toggleSubthemeSelected(subthemeId)}
        />
      )
    });

    return (
      <List component="div" disablePadding>
        {subthemeListItems}
      </List>
    )
  }
}

SubthemeList.propTypes = {
  themeId: PropTypes.number.isRequired,
  themeName: PropTypes.string.isRequired,
  subthemes: PropTypes.array.isRequired,
  selectedSubthemes: PropTypes.array.isRequired,
  fetchSubthemes: PropTypes.func.isRequired,
  toggleSubthemeSelected: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  subthemes: state.subthemes.subthemes,
  selectedSubthemes: state.subthemes.selected,
});

const mapDispatchToProps = dispatch => ({
  fetchSubthemes: themeName => dispatch(fetchSubthemes(themeName)),
  toggleSubthemeSelected: subthemeId => dispatch(toggleSubthemeSelected(subthemeId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubthemeList)
