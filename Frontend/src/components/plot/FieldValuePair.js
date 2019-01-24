import React from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    margin: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  formLabel: {

  },
  inputLabel: {

  },
  select: {

  },
  menuItem: {

  },
});

class FieldValuePair extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      names: props.names,
      values: props.values,
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <FormLabel className={classes.formLabel}>field/value pair</FormLabel>
        <FormControl className={classes.formControl}>
          <InputLabel className={classes.inputLabel}>field</InputLabel>
          <Select className={classes.select}>

          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel className={classes.inputLabel}>label</InputLabel>
          <Select className={classes.select}>

          </Select>

        </FormControl>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

FieldValuePair = withStyles(styles)(FieldValuePair);
FieldValuePair = connect(mapStateToProps, mapDispatchToProps)(FieldValuePair);

FieldValuePair.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default FieldValuePair
