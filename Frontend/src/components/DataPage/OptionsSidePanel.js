import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Divider,
  Paper,
  Typography,
  withStyles,
} from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import BarChartIcon from '@material-ui/icons/BarChart';
import { connect } from 'react-redux';
import { openEditor } from '../../actions/editorActions';

const styles = (theme) => ({
  root: {
    marginLeft: theme.spacing.unit * 2,
    width: "240px",
    position: "relative",
  },
  paper: {
    padding: theme.spacing.unit * 2,
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
  },
  actionButton: {
    width: '175px',
    margin: `${theme.spacing.unit}px auto`,
  },
  actionButtonIcon: {
    marginRight: theme.spacing.unit,
  },
  divider: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class OptionsSidePanel extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  handleEditorOpen = (type='plot') => {


    // ToDo :: need to pass the type from some sort of menu
    this.props.openEditor('add', { type })
  };

  render() {
    const { classes, dataTable } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h6" className={classes.heading}>
            Actions
          </Typography>
          <Divider
            className={classes.divider}
            light={true}
          />
          <div className={classes.actionButtons}>
            <Button disabled={!dataTable.data.length} variant="contained" color="primary" className={classes.actionButton}>
              <SaveAltIcon className={classes.actionButtonIcon} />
              Export Data
            </Button>
            <Button disabled={!dataTable.data.length} variant="contained" color="primary" className={classes.actionButton} onClick={this.handleEditorOpen}>
              <BarChartIcon className={classes.actionButtonIcon} />
              Create Widget
            </Button>
          </div>
        </Paper>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  dataTable: state.dataTable,
});

const mapDispatchToProps = (dispatch) => ({
  openEditor: (widgetType, widgetProperties) => dispatch(openEditor(widgetType, widgetProperties)),
});

OptionsSidePanel = withStyles(styles)(OptionsSidePanel);
OptionsSidePanel = connect(mapStateToProps, mapDispatchToProps)(OptionsSidePanel);

export default OptionsSidePanel
