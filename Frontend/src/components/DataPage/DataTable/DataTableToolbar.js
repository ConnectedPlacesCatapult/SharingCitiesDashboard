import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
});

class DataTableToolbar extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    attributeName: PropTypes.string.isRequired,
    attributeDescription: PropTypes.string.isRequired,
  };
  
  render() {
    const { classes, attributeName, attributeDescription } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="h6">
          {attributeName}
        </Typography>
        <Typography color="primary" variant="subtitle1">
          {attributeDescription}
        </Typography>
      </div>
    )
  }
}

DataTableToolbar = withStyles(styles)(DataTableToolbar);

export default DataTableToolbar
