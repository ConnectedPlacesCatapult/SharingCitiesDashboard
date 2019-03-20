import React from "react";
import PropTypes from "prop-types";

// material-ui
import { withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import RerunIcon from "@material-ui/icons/Replay";
import FilterListIcon from "@material-ui/icons/FilterList";
import { lighten } from "@material-ui/core/styles/colorManipulator";

// misc utils
import classNames from "classnames";

const styles = (theme) => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
    color: 'white',
  },
});

class UserTableToolbar extends React.Component {
  render() {
    const { classes, numSelected } = this.props;

    return (
      <Toolbar className={classNames(classes.root, { [classes.highlight]: numSelected > 0, })}>
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="textPrimary" variant="subtitle1">
              {numSelected} selected
            </Typography>
          ) : null}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 ? (
            <Tooltip title="Rerun Selected">
              <IconButton onClick={() => this.props.onRerunClick()} aria-label="Rerun">
                <RerunIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Filter list">
              <IconButton aria-label="Filter list">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Toolbar>
    )
  }
}

UserTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRerunClick: PropTypes.func.isRequired,
};

UserTableToolbar = withStyles(styles)(UserTableToolbar);

export default UserTableToolbar
