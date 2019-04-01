import React from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
} from '@material-ui/core';

import DataTable from './../DataTable';

const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit * 2,
  }
});

class TabContent extends React.Component {
  state = {
    isActive: this.props.isActive,
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes, isActive, ...rest } = this.props;

    if (!isActive) return null;

    return (
      <div className={classes.root}>
        <DataTable
          {...rest}
        />
      </div>
    )
  }
}

TabContent = withStyles(styles)(TabContent);

export default TabContent
