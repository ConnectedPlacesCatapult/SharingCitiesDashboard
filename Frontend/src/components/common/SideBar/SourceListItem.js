import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  darkColor: {
    color: theme.palette.primary.dark,
  },
});

class SourceListItem extends Component {
  render() {
    const { classes, name, isSelected, onClick } = this.props;

    return (
      <div>
        <ListItem button className={classes.nested} onClick={onClick}>
          {
            isSelected
              ? <RadioButtonCheckedIcon fontSize="small" color="secondary" />
              : <RadioButtonUncheckedIcon fontSize="small" className={classes.darkColor} />
          }
          <ListItemText inset primary={name} />
        </ListItem>
      </div>
    )
  }
}

SourceListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(SourceListItem);
