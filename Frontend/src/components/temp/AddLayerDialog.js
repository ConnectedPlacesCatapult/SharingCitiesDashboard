import React from 'react';

// redux
import { connect } from 'react-redux';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from '@material-ui/core/FormLabel'
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing.unit * 2,
  },
  form: {

  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class AddLayerDialog extends React.Component {
  state = {
    mark: this.props.config.vega.plotTypes[0],
  };

  getMenuItems = (arr=[]) => {
    return arr.map((val, i) => {
      return <MenuItem key={i} value={val}>{val}</MenuItem>
    })
  };

  handleChange = (name) => e => {
    this.setState({ [name]: e.target.value })
  };

  render() {
    const { classes, onClose, config, ...other } = this.props;

    return (
      <Dialog
        className={classes.root}
        onClose={onClose}
        {...other}
      >
        <DialogTitle>Add Layer</DialogTitle>
        <br />
        <form className={classes.form}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="layer-mark">Mark</InputLabel>
            <Select
              value={this.state.mark}
              onChange={this.handleChange('mark')}
              inputProps={{
                name: 'mark',
                id: 'layer-mark',
              }}
            >
            {this.getMenuItems(config.vega.plotTypes)}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <FormLabel>Encoding</FormLabel>
            <Button variant="contained" color="primary" className={classes.button}>
              Add channel
              <AddIcon/>
            </Button>
          </FormControl>
        </form>
      </Dialog>
    )
  }
}

const mapStateToProps = (state) => ({
  config: state.config.config,
});

const mapDispatchToProps = (dispatch) => ({

});

AddLayerDialog = withStyles(styles)(AddLayerDialog);
AddLayerDialog = connect(mapStateToProps, mapDispatchToProps)(AddLayerDialog);

export default AddLayerDialog
