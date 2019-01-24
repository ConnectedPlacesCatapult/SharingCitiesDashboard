import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

const styles = theme => ({
  root: {

  },
});

class VegaLiteFormControl extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <FormControl className={classes.root}>
        <FormLabel>VegaLiteFormControl</FormLabel>
      </FormControl>
    )
  }
}

VegaLiteFormControl.propTypes = {
  classes: PropTypes.object.isRequired,
};

VegaLiteFormControl = withStyles(styles)(VegaLiteFormControl);

export default VegaLiteFormControl
