import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";

const styles = theme => ({
  root: {

  },
});

class LayerDialog extends React.Component {


  render() {
    const { classes, plotTypes, getMenuItems, ...other } = this.props;

    return (
      <Dialog onClose={this.props.onClose} {...other}>
        <DialogTitle>Add Layer</DialogTitle>
        <form>
          <FormControl>
            <Select
              value={plotTypes[0]}
            >
              {getMenuItems(plotTypes)}
            </Select>
          </FormControl>
        </form>
      </Dialog>
    )
  }
}

export default withStyles(styles)(LayerDialog)
