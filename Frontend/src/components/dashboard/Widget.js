import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
  widget: {
    borderRadius: '3px',
    padding: theme.spacing.unit,
    height: '100%',
  },
  widgetHeader: {
    overflow: 'hidden',
  },
  widgetTitle: {
    flexGrow: 1,
    color: theme.palette.common.white,
    float: 'left',
  },
  widgetButtons: {
    display: 'block',
    float: 'right',
  },
  widgetBodyWrapper: {

  },
  widgetBodyContent: {

  },
  smallerButton: {
    padding: theme.spacing.unit,
    transform: 'scale(0.8)',
  },
});

class Widget extends React.Component {
  render() {
    const { classes, title } = this.props;

    return (
      <Paper className={classes.widget}>
        <div className={classes.widgetHeader}>
          <Typography variant="subtitle1" className={classes.widgetTitle}>
            {title}
          </Typography>
          <div className={classes.widgetButtons}>
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
            WIDGET BODY
          </div>
        </div>
      </Paper>
    )
  }
}

Widget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Widget);
