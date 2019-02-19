import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import { connect } from 'react-redux';
import { fetchAttributes } from '../../../actions/apiActions';

import AttributeListItem from './AttributeListItem';

class AttributeList extends React.Component {
  constructor(props) {
    super(props);

    if (!props.themes.find((theme) => theme.id === props.themeId).subthemes.find((subtheme) => subtheme.id === props.subthemeId).attributes.length) {
      props.fetchAttributes(props.themeId, props.subthemeId)
    }
  }

  render() {
    const { themeId, subthemeId, themes } = this.props;

    const themeSubthemes = themes.find((theme) => theme.id === themeId).subthemes;
    const parentSubtheme = themeSubthemes.find((subtheme) => subtheme.id === subthemeId);
    const attributeListItems = parentSubtheme.attributes.map((attr, i) => {
      return (
        <AttributeListItem
          key={i}
          themeId={themeId}
          subthemeId={subthemeId}
          attributeName={attr.name}
          isSelected={attr.isSelected}
        />
      )
    });

    return (
      <List>
        {attributeListItems}
      </List>
    )
  }
}

AttributeList.propTypes = {
  themeId: PropTypes.number.isRequired,
  subthemeId: PropTypes.number.isRequired,
  themes: PropTypes.array.isRequired,
  fetchAttributes: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  themes: state.api.themes,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAttributes: (themeId, subthemeId) => dispatch(fetchAttributes(themeId, subthemeId)),
});

AttributeList = connect(mapStateToProps, mapDispatchToProps)(AttributeList);

export default AttributeList
