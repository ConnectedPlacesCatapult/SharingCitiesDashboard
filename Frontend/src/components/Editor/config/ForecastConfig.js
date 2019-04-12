import React from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  Divider,
  FormControl,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  withStyles,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { connect } from 'react-redux';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  spacer: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class ForecastConfig extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;

    return (
      <FormGroup className={classes.root}>
        <Divider className={classes.spacer} />
        forecast options go here
      </FormGroup>
    )
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

ForecastConfig = withStyles(styles)(ForecastConfig);
ForecastConfig = connect(mapStateToProps, mapDispatchToProps)(ForecastConfig);

export default ForecastConfig
