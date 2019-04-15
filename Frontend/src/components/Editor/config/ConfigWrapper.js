import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Paper,
  Tab,
  Tabs,
  Typography,
  withStyles,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { connect } from 'react-redux';
import WidgetConfig from './WidgetConfig';
import AlertConfig from './AlertConfig';
import ForecastConfig from './ForecastConfig';
import MapConfig from './MapConfig';
import PlotConfig from './PlotConfig';
import DataConfig from './DataConfig';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: theme.spacing.unit * 40,
    padding: theme.spacing.unit,
    borderRadius: '4px 0 0 4px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    color: theme.palette.text.primary,
    marginBottom: theme.spacing.unit,
  },
  headerIcon: {
    margin: `0 ${theme.spacing.unit}px`,
  },
});

class ConfigWrapper extends React.Component {
  state = {
    selectedTabIndex: 0,
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
  };

  handleChangeTab = (e, tabIndex) => {
    this.setState({ selectedTabIndex: tabIndex })
  };

  render() {
    const { classes, editor } = this.props;
    const { selectedTabIndex } = this.state;

    return (
      <Paper className={classes.root}>
        <div className={classes.header}>
          <SettingsIcon className={classes.headerIcon} fontSize="small" />
          <Typography variant="subtitle1">Widget Editor</Typography>
        </div>
        <AppBar position="static" elevation={0}>
          <Tabs
            value={selectedTabIndex}
            onChange={this.handleChangeTab}
            variant="standard"
          >
            <Tab value={0} label="General options" />
            <Tab value={1} label={`${editor.widget.type.charAt(0).toUpperCase() + editor.widget.type.slice(1)} options`} />
            <Tab value={2} label="Data set" />
          </Tabs>
        </AppBar>
        {selectedTabIndex === 0 && <WidgetConfig />}
        {selectedTabIndex === 1 && editor.widget.type === "alert" && <AlertConfig />}
        {selectedTabIndex === 1 && editor.widget.type === "forecast" && <ForecastConfig />}
        {selectedTabIndex === 1 && editor.widget.type === "map" && <MapConfig />}
        {selectedTabIndex === 1 && editor.widget.type === "plot" && <PlotConfig />}
        {selectedTabIndex === 2 && <DataConfig />}
      </Paper>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

ConfigWrapper = withStyles(styles)(ConfigWrapper);
ConfigWrapper = connect(mapStateToProps, null)(ConfigWrapper);

export default ConfigWrapper
