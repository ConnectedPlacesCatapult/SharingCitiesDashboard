import React from 'react';
import PropTypes from 'prop-types';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  withStyles,
} from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';

const styles = (theme) => ({
  root: {

  },
});

class ExportDataMenu extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    anchorEl: null,
  };

  handleFormatClicked = (format) => {
    // do some async stuff
  };

  handleClose = () => {
    const { onClose } = this.props;

    onClose()
  };

  render() {
    const { classes, anchorEl } = this.props;

    return (
      <Menu
        className={classes.root}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={this.handleClose}
      >
        <MenuItem onClick={() => this.handleFormatClicked('json')}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="JSON" />
        </MenuItem>
      </Menu>
    )
  }
}

ExportDataMenu = withStyles(styles)(ExportDataMenu);

export default ExportDataMenu
