import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import LayerMark from './LayerMark';
import LayerEncoding from './LayerEncoding';

const styles = theme => ({
  root: {

  },
});

class Layer extends React.Component {
  render() {
    const { classes, layerIndex } = this.props;

    return (
      <div className={classes.root}>
        <LayerMark layerIndex={layerIndex} />
        <LayerEncoding layerIndex={layerIndex} />
      </div>
    )
  }
}

Layer.propTypes = {
  classes: PropTypes.object.isRequired,
  layerIndex: PropTypes.number.isRequired,
};

export default withStyles(styles)(Layer)
