import React from 'react';
import PropTypes from 'prop-types';

import AttributeListItem from './AttributeListItem';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

// redux
import { connect } from 'react-redux';
import {
  fetchAttributes,
  toggleAttributeSelected
} from "../../../actions/apiActions";

const styles = (theme) => ({
  root: {

  },
});

class AttributeList extends React.Component {
  constructor(props) {
    super(props);

    if (!props.themes.find(theme => theme.id === props.themeId).subthemes.find(subtheme => subtheme.id === props.subthemeId).attributes.length) {
      props.fetchAttributes(props.themeId, props.subthemeId)
    }
  }

  render() {
    const { themeId, subthemeId, themes, toggleAttributeSelected } = this.props;

    const themeSubthemes = themes.find(theme => theme.id === themeId).subthemes;
    const parentSubtheme = themeSubthemes.find(subtheme => subtheme.id === subthemeId);
    const attributeListItems = parentSubtheme.attributes.map((attr, i) => {
      return (
        <AttributeListItem
          key={i}
          themeId={themeId}
          subthemeId={subthemeId}
          attributeId={attr.id}
          attributeName={attr.name}
          isSelected={attr.isSelected}
          onClick={() => toggleAttributeSelected(themeId, subthemeId, attr.id)}
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
  toggleAttributeSelected: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  themes: state.api.themes,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAttributes: (themeId, subthemeId) => dispatch(fetchAttributes(themeId, subthemeId)),
  toggleAttributeSelected: (themeId, subthemeId, attributeId) => dispatch(toggleAttributeSelected(themeId, subthemeId, attributeId)),
});

AttributeList = withStyles(styles)(AttributeList);
AttributeList = connect(mapStateToProps, mapDispatchToProps)(AttributeList);

export default AttributeList
