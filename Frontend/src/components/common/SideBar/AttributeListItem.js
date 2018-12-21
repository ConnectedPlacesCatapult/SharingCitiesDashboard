import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import { connect } from 'react-redux';
import { discardAttributeData, fetchAttributeData } from "../../../actions/dataActions";

const styles = theme => ({
  root: {

  },
  nested: {
    paddingLeft: theme.spacing.unit * 6,
  },
  darkColor: {
    color: theme.palette.primary.dark,
  },
});

class AttributeListItem extends React.Component {
  handleClick = () => {
    const { themeId, subthemeId, attributeId, attributeName, discardAttributeData, fetchAttributeData, isSelected, onClick } = this.props;

    // toggle whether data state includes this attribute's data
    if (isSelected) {
      discardAttributeData(themeId, subthemeId, attributeId, attributeName)
    } else {
      fetchAttributeData(themeId, subthemeId, attributeId, attributeName);
    }

    // toggle isSelected
    onClick();
  };

  render() {
    const { classes, attributeName, isSelected } = this.props;

    return (
      <ListItem button className={classes.nested} onClick={this.handleClick}>
        {
          isSelected
            ? <RadioButtonCheckedIcon fontSize="small" color="secondary" />
            : <RadioButtonUncheckedIcon fontSize="small" className={classes.darkColor} />
        }
        <ListItemText inset primary={attributeName} />
      </ListItem>
    )
  }
}

AttributeListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  themeId: PropTypes.number.isRequired,
  subthemeId: PropTypes.number.isRequired,
  attributeId: PropTypes.string.isRequired,
  attributeName: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  discardAttributeData: PropTypes.func.isRequired,
  fetchAttributeData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  data: state.data.data,
});

const mapDispatchToProps = dispatch => ({
  discardAttributeData: (themeId, subthemeId, attributeId, attributeName) => dispatch(discardAttributeData(themeId, subthemeId, attributeId, attributeName)),
  fetchAttributeData: (themeId, subthemeId, attributeId, attributeName) => dispatch(fetchAttributeData(themeId, subthemeId, attributeId, attributeName)),
});

AttributeListItem = withStyles(styles)(AttributeListItem);

export default connect(mapStateToProps, mapDispatchToProps)(AttributeListItem)
