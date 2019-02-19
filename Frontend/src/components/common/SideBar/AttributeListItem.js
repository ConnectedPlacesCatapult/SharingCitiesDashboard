import React from 'react';
import PropTypes from 'prop-types';
import {
  ListItem,
  ListItemText,
  withStyles,
} from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import { connect } from 'react-redux';
import {
  toggleAttributeSelected,
  fetchAttributeData,
  removeAttributeData,
} from '../../../actions/apiActions';

const styles = (theme) => ({
  nested: {
    paddingLeft: theme.spacing.unit * 6,
  },
});

class AttributeListItem extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    themeId: PropTypes.number.isRequired,
    subthemeId: PropTypes.number.isRequired,
    attributeName: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    toggleAttributeSelected: PropTypes.func.isRequired,
    fetchAttributeData: PropTypes.func.isRequired,
    removeAttributeData: PropTypes.func.isRequired,
  };

  handleClick = () => {
    const { themeId, subthemeId, attributeName, isSelected, toggleAttributeSelected, fetchAttributeData, removeAttributeData } = this.props;

    // toggles attribute selected
    toggleAttributeSelected(themeId, subthemeId, attributeName);

    // either append or remove attribute data
    if (isSelected) {
      removeAttributeData(attributeName);
    } else {
      fetchAttributeData(attributeName, {});
    }
  };

  render() {
    const { classes, attributeName, isSelected } = this.props;

    return (
      <ListItem button className={classes.nested} onClick={this.handleClick}>
        {isSelected
          ? <RadioButtonCheckedIcon fontSize="small" color="primary" />
          : <RadioButtonUncheckedIcon fontSize="small" color="primary" />
        }
        <ListItemText inset primary={attributeName} />
      </ListItem>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  toggleAttributeSelected: (themeId, subthemeId, attributeName) => dispatch(toggleAttributeSelected(themeId, subthemeId, attributeName)),
  fetchAttributeData: (attributeName, queryParams) => dispatch(fetchAttributeData(attributeName, queryParams)),
  removeAttributeData: (attributeName) => dispatch(removeAttributeData(attributeName)),
});

AttributeListItem = withStyles(styles)(AttributeListItem);
AttributeListItem = connect({}, mapDispatchToProps)(AttributeListItem);

export default AttributeListItem
