import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  TableBody,
  TableCell,
  TableRow,
  withStyles,
} from '@material-ui/core';

const styles = (theme) => ({
  cellValue: {
    color: theme.palette.text.primary,
    fontWeight: 400,
  },
  cellBorder: {
    borderColor: theme.palette.background.default,
  },
});

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;

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
  static propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };

  render() {
    const { classes, data, columns, order, orderBy, page, rowsPerPage } = this.props;

    const cells = (row) => {
      return columns.map((column, i) =>
        <TableCell
          key={i}
          numeric={column.numeric}
          padding={(i === 0 || i === (columns.length - 1)) ? 'none' : 'default'}
          className={classNames(classes.cellValue, classes.cellBorder)}
        >
          {row[column.id]}
        </TableCell>
      )
    };
    const rows = stableSort(data, getSorting(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((row, i) => <TableRow key={i} tabIndex={-1}>{cells(row)}</TableRow>);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <TableBody>
        {rows}
        {emptyRows > 0 &&
          <TableRow style={{ height: 49 * emptyRows }}>
            <TableCell
              colSpan={columns.length}
              className={classNames(classes.cellValue, classes.cellBorder)}
            />
          </TableRow>
        }
      </TableBody>
    )
  }
}

export default withStyles(styles)(DataTableBody)
