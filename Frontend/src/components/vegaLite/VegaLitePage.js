import React from 'react';
import PropTypes from 'prop-types';

// form components
import VegaLiteFormControl from './VegaLiteFormControl';

// redux
import { connect } from 'react-redux';
import {

} from './../../actions/vegaLiteActions';

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
import Typography from "@material-ui/core/Typography";
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from "@material-ui/core/ListItem";
import Divider from '@material-ui/core/Divider';

// vega
import VegaLite from 'react-vega-lite';
import {
  VEGA_LITE_AGGREGATE_OPERATIONS,
  VEGA_LITE_DATA_TYPES,
  VEGA_LITE_ENCODING_CHANNELS,
  VEGA_LITE_FIELDS,
  VEGA_LITE_MARKS,
  VEGA_LITE_TIME_UNITS,
} from "../../constants";

const styles = theme => ({
  root: {
    margin: theme.spacing.unit,
  },
  lists: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  list: {
    margin: theme.spacing.unit,
  }
});

class VegaLitePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    const listAggregateOperations = VEGA_LITE_AGGREGATE_OPERATIONS.map((op, i) => {
      return <ListItem key={i}>{op}</ListItem>
    });

    const listDataTypes = VEGA_LITE_DATA_TYPES.map((type, i) => {
      return <ListItem key={i}>{type}</ListItem>
    });

    const listEncodingChannels = VEGA_LITE_ENCODING_CHANNELS.map((channel, i) => {
      return <ListItem key={i}>{channel}</ListItem>
    });

    const listMarks = VEGA_LITE_MARKS.map((mark, i) => {
      return <ListItem key={i}>{mark}</ListItem>
    });

    const listTimeUnits = VEGA_LITE_TIME_UNITS.map((unit, i) => {
      return <ListItem key={i}>{unit}</ListItem>
    });

    const listFields = VEGA_LITE_FIELDS.map((field, i) => {
      return (
        <ListItem key={i}>
          {field.name}
        </ListItem>
      )
    });

    return (
      <div className={classes.root}>
        <Typography variant="h2">VegaLitePage</Typography>
        <Typography variant="subheading">Permitted Fields & Values</Typography>
        <div className={classes.lists}>
          <List className={classes.list}>
            <ListSubheader>Aggregate Operations</ListSubheader>
            {listAggregateOperations}
          </List>
          <List className={classes.list}>
            <ListSubheader>Data Types</ListSubheader>
            {listDataTypes}
          </List>
          <List className={classes.list}>
            <ListSubheader>Encoding Channels</ListSubheader>
            {listEncodingChannels}
          </List>
          <List className={classes.list}>
            <ListSubheader>Marks</ListSubheader>
            {listMarks}
          </List>
          <List className={classes.list}>
            <ListSubheader>Time Units</ListSubheader>
            {listTimeUnits}
          </List>
        </div>
        <Divider />
        <div className={classes.lists}>
          <List className={classes.list}>
            <ListSubheader>Fields</ListSubheader>
            {listFields}
          </List>
        </div>
        <Divider />
        <VegaLiteFormControl/>
        <Divider />
        <VegaLite spec={this.props.vegaLite.spec} data={this.props.vegaLite.data} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  vegaLite: state.vegaLite,
});

const mapDispatchToProps = (dispatch) => ({

});

VegaLitePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

VegaLitePage = withStyles(styles)(VegaLitePage);
VegaLitePage = connect(mapStateToProps, mapDispatchToProps)(VegaLitePage);

export default VegaLitePage
