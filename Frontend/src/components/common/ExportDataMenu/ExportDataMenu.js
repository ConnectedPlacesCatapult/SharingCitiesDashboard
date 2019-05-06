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
import { exportData } from "../../../actions/dataTableActions";
import {connect} from "react-redux";

const styles = (theme) => ({
  root: {

  },
});

class ExportDataMenu extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    exportData: PropTypes.func.isRequired,
  };

  static defaultProps = {
    anchorEl: null,
  };

  handleFormatClicked = (format) => {
    const { exportData, dataTable } = this.props;
    exportData(dataTable.data[0].Attribute_Table)
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

const mapStateToProps = (state) => ({
  dataTable: state.dataTable,
});

const mapDispatchToProps = (dispatch) => ({
  exportData: (tables) => dispatch(exportData(tables)),
});

ExportDataMenu = withStyles(styles)(ExportDataMenu);
ExportDataMenu = connect(null, mapDispatchToProps)(ExportDataMenu);
ExportDataMenu = connect(mapStateToProps, null)(ExportDataMenu);

export default ExportDataMenu
