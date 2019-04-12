import React from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
} from '@material-ui/core';
import ConfigWrapper from './config/ConfigWrapper';
import PreviewWrapper from './preview/PreviewWrapper';


const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

class Editor extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <ConfigWrapper/>
        <PreviewWrapper/>
      </div>
    )
  }
}

Editor = withStyles(styles)(Editor);

export default Editor
