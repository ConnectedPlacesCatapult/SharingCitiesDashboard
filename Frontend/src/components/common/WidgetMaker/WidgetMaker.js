import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import ConfigPanel from './ConfigPanel';
import PreviewPanel from './PreviewPanel';

const styles = (theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

class WidgetMaker extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <ConfigPanel />
        <PreviewPanel />
      </div>
    )
  }
}

WidgetMaker = withStyles(styles)(WidgetMaker);

export default WidgetMaker
