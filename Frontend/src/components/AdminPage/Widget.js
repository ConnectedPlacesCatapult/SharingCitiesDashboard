import React from 'react';
import PropTypes from 'prop-types';

import MapWidget from "./MapWidget";
import PlotWidget from "./PlotWidget";

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import InfoIcon from '@material-ui/icons/Info';
import OpenWithIcon from '@material-ui/icons/OpenWith';

const styles = (theme) => ({
  widget: {
    borderRadius: '3px',
    // padding: theme.spacing.unit,
    height: '100%',
  },
  widgetHeader: {
    // padding: theme.spacing.unit,
    overflow: 'hidden',
    backgroundColor: "#212121"
  },
  widgetTitleContainer: {
    // backgroundColor: "#fafafa",
    display: 'block',
    float: 'left',
  },
  widgetTitle: {
    color: "white",
    paddingTop: "5px",
    paddingLeft: "10px",
    fontWeight: "600"
  },
  widgetButtons: {
    display: 'block',
    float: 'right',
  },
  widgetBodyWrapper: {
    overflow: 'hidden',
    position: 'relative',
    height: '100%',
    padding: theme.spacing.unit,
  },
  widgetBodyContent: {
    height: '100%',
    width: 'auto',
  },
  smallerButton: {
    padding: theme.spacing.unit,
    transform: 'scale(0.8)',
  },
});

class Widget extends React.Component {
  render() {
    const { classes, title, isStatic, type, data } = this.props;

    return (
      <Paper className={classes.widget}>
        <div className={classes.widgetHeader}>
          <div className={classes.widgetTitleContainer}>
            <Typography variant="subtitle1" className={classes.widgetTitle}>
              {title}
            </Typography>
          </div>
          <div className={classes.widgetButtons}>
            {
              !isStatic
              ? <IconButton
                  color="primary"
                  className={classes.smallerButton}
                >
                  <OpenWithIcon fontSize="small" className="draggableHandle" />
                </IconButton>
              : ''
            }
            <IconButton
              color="primary"
              className={classes.smallerButton}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="primary"
              className={classes.smallerButton}
            >
              <AddCircleIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="primary"
              className={classes.smallerButton}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
        <div className={classes.widgetBodyWrapper}>
          <div className={classes.widgetBodyContent}>
            { type === 'plot'
              ? <PlotWidget spec={this.props.spec} data={data} />
              : <MapWidget tileLayer={this.props.tileLayer} data={data} />
            }
          </div>
        </div>
      </Paper>
    )
  }
}

Widget.propTypes = {
  classes: PropTypes.object.isRequired,
};

Widget = withStyles(styles, { withTheme: true })(Widget);

export default Widget
