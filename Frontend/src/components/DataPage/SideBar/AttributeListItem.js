import React from 'react';
import PropTypes from 'prop-types';
import {
  ListItem,
  ListItemText,
  withStyles,
  Typography
} from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import { connect } from 'react-redux';
import {
  toggleAttributeSelected,
  fetchAttributeData,
  removeAttributeData,
} from '../../../actions/dataTableActions';

const styles = (theme) => ({
  nested: {
    paddingLeft: theme.spacing.unit * 6,
  },
  listItemText: {
    color: theme.palette.primary.dark,
    fontWeight: '500'
  },
});

class AttributeListItem extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    themeId: PropTypes.number.isRequired,
    subthemeId: PropTypes.number.isRequired,
    attributeId: PropTypes.string.isRequired,
    attributeName: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    toggleAttributeSelected: PropTypes.func.isRequired,
    fetchAttributeData: PropTypes.func.isRequired,
    removeAttributeData: PropTypes.func.isRequired,
  };

  handleClick = () => {
    const { themeId, subthemeId, attributeId, attributeName, isSelected, toggleAttributeSelected, fetchAttributeData, removeAttributeData } = this.props;

    // toggles attribute selected
    toggleAttributeSelected(themeId, subthemeId, attributeId);

    // either append or remove attribute data
    if (isSelected) {
      removeAttributeData(attributeId);
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
        <ListItemText
          disableTypography
          primary={<Typography variant="subtitle1" color="primary" className={classes.listItemText}>{attributeName}</Typography>}
        />
      </ListItem>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  toggleAttributeSelected: (themeId, subthemeId, attributeId) => dispatch(toggleAttributeSelected(themeId, subthemeId, attributeId)),
  fetchAttributeData: (attributeId, queryParams) => dispatch(fetchAttributeData(attributeId, queryParams)),
  removeAttributeData: (attributeId) => dispatch(removeAttributeData(attributeId)),
});

AttributeListItem = withStyles(styles)(AttributeListItem);
AttributeListItem = connect(null, mapDispatchToProps)(AttributeListItem);

export default AttributeListItem
