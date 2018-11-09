import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";

const styles = theme => ({
  cellValue: {
    color: theme.palette.primary.main,
    fontWeight: 400,
  },
});

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

class DataTableBody extends React.Component {
  generateCells = rowData => {
    const { classes, columns } = this.props;

    let cells = [];

    columns.forEach((column, i) => {
      let cell;

      if (i === 0) {
        cell = <TableCell
          key={i + 1}
          component="th"
          scope="row"
          numeric={column.numeric}
          padding="none"
          className={classes.cellValue}
        >
          {rowData[column.id]}
        </TableCell>
      } else {
        cell = <TableCell
          key={i + 1}
          numeric={column.numeric}
          padding="default"
          className={classes.cellValue}
        >
          {rowData[column.id]}
        </TableCell>
      }

      cells.push(cell);
    });

    return cells;
  };

  render() {
    const { data, columns, order, orderBy, page, rowsPerPage } = this.props;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <TableBody>
        {stableSort(data, getSorting(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((n, i) => {
            const key = i + (page * rowsPerPage);
            const selected = this.props.isSelected(key);

            return (
              <TableRow
                hover
                onClick={() => this.props.onClick(key)}
                role="checkbox"
                aria-checked={selected}
                tabIndex={-1}
                key={key}
                selected={selected}
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={selected} />
                </TableCell>
                {this.generateCells(n)}
              </TableRow>
            );
          })}
        {emptyRows > 0 && (
          <TableRow style={{ height: 49 * emptyRows }}>
            <TableCell colSpan={columns.length} />
          </TableRow>
        )}
      </TableBody>
    )
  }
}

DataTableBody.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
};

export default withStyles(styles)(DataTableBody)
