import React from 'react';
import PropTypes from 'prop-types';

import ConfigPanel from './ConfigPanel';
import PreviewPanel from './PreviewPanel';

// material-ui
import { withStyles } from '@material-ui/core/styles';

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

WidgetMaker.propTypes = {
  classes: PropTypes.object.isRequired,
};

WidgetMaker = withStyles(styles)(WidgetMaker);

export default WidgetMaker
