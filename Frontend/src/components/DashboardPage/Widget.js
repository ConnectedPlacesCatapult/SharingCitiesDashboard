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
import DeleteIcon from '@material-ui/icons/Delete';

import { promptDeleteWidget } from "./../../actions/dashboardActions";
import {connect} from "react-redux";

const styles = (theme) => ({
  widget: {
    borderRadius: '5px',
    height: '100%',
    padding: theme.spacing.unit * 1,
  },
  widgetHeader: {
    overflow: 'hidden',
    backgroundColor: theme.palette.paper,
  },
  widgetDeleteConfirmation: {
    overflow: 'hidden',
    backgroundColor: "#b74218"
  },
  widgetTitleContainer: {
    display: 'block',
    float: 'left',
  },
  widgetTitle: {
    color: theme.palette.tertiary.main,
    paddingTop: "5px",
    paddingLeft: "10px",
    fontWeight: "600"
  },
  widgetButtons: {
    color: theme.palette.secondary.main,
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
    const { classes, title, isStatic, type, data, i, promptDeleteWidget } = this.props;

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
            {/*<IconButton*/}
              {/*color="primary"*/}
              {/*className={classes.smallerButton}*/}
            {/*>*/}
              {/*<InfoIcon fontSize="small" />*/}
            {/*</IconButton>*/}
            {/*<IconButton*/}
              {/*color="primary"*/}
              {/*className={classes.smallerButton}*/}
            {/*>*/}
              {/*<AddCircleIcon fontSize="small" />*/}
            {/*</IconButton>*/}
            <IconButton
              onClick={() => promptDeleteWidget(i)}
              color="primary"
              className={classes.smallerButton}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
        <div className={classes.widgetBodyWrapper}>
          <div className={classes.widgetBodyContent}>
            { type === "plot"
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

const mapStateToProps = (state) => ({
  dashboard: state.dashboard,
});

const mapDispatchToProps = (dispatch) => ({
  promptDeleteWidget: (widgetID) => dispatch(promptDeleteWidget(widgetID)),
});

Widget = withStyles(styles, { withTheme: true })(Widget);
Widget = connect(mapStateToProps, mapDispatchToProps)(Widget);

export default Widget
