import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

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
    this.props.onClick()
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
};

export default withStyles(styles)(AttributeListItem)
