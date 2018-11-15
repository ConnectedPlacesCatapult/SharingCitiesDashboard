import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import ConfigPanel from './ConfigPanel';
import PreviewPanel from './PreviewPanel';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    //width: theme.spacing.unit * 150,
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

export default withStyles(styles)(WidgetMaker)
