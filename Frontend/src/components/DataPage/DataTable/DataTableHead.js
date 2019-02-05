import React from "react";
import PropTypes from "prop-types";

// material-ui
import { withStyles } from "@material-ui/core/styles";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import TableSortLabel from "@material-ui/core/TableSortLabel";

const styles = (theme) => ({
  columnLabel: {
    color: theme.palette.primary.light,
    fontWeight: 600,
  },
  overRideInternalStateStyles: {
    color: theme.palette.primary.light,
  },
  checkBox: {
    color: theme.palette.primary.main,
  },
  cellBorder: {
    borderColor: theme.palette.background.default,
  },
  labelRoot: {
    color: theme.palette.primary.light,
    fontWeight: 600,
    '&$focus': {
      color: theme.palette.primary.light,
    },
    '&$hover': {
      color: theme.palette.primary.light,
    },
  },
  labelActive: {
    color: theme.palette.primary.light,
  },
  focus: {

  },
  hover: {

  }
});

class DataTableHead extends React.Component {
  createSortHandler = (property) => (e) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { classes, onSelectAllClick, order, orderBy, numSelected, columns, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox" className={classes.cellBorder}>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
              className={classes.checkBox}
            />
          </TableCell>
          {columns.map((column, i) => {
            return (
              <TableCell
                key={i}
                numeric={column.numeric}
                padding={(i === 0) ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
                className={classes.cellBorder}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                    //className={classes.columnLabel}
                    classes={{
                      root: classes.labelRoot,
                      active: classes.labelActive,
                      //hover: classes.hover,
                      //focus: classes.focus,
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    )
  }
}

DataTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default withStyles(styles)(DataTableHead)
