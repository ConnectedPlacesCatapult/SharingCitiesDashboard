import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';
import Color from "color";

import TypeSelector from './TypeSelector';

const styles = theme => ({
  root: {

  },
  paper: {
    backgroundColor: Color(theme.palette.primary.dark).alpha(0.95).rgb().string(),
  },
  heading: {
    color: 'white',
  },
});

class ConfigPanel extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h6" className={classes.heading}>
            Widget Creator
          </Typography>
          <TypeSelector />
        </Paper>
      </div>
    )
  }
}

ConfigPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ConfigPanel)
