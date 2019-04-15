import React from 'react';
import PropTypes from 'prop-types';
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  withStyles,
} from '@material-ui/core';

const styles = (theme) => ({
  cellBorder: {
    borderColor: theme.palette.background.default,
  },
  labelRoot: {
    color: theme.palette.text.primary,
    fontWeight: 600,
  },
  labelActive: {
    color: theme.palette.text.primary,
    fontWeight: 600,
  },
  labelHover: {
    color: theme.palette.text.primary,
    fontWeight: 800,
  },
});

class DataTableHead extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
  };

  createSortHandler = (property) => (e) => {
    this.props.onRequestSort(e, property);
  };

  render() {
    const { classes, order, orderBy, columns } = this.props;

    return (
      <TableHead>
        <TableRow>
          {columns.map((column, i) =>
              <TableCell
                key={i}
                numeric={column.numeric}
                padding={(i === 0 || i === (columns.length - 1)) ? 'none' : 'default'}
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
                    classes={{
                      root: classes.labelRoot,
                      active: classes.labelActive,
                      hover: classes.labelHover,
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            )
          }
        </TableRow>
      </TableHead>
    )
  }
}

export default withStyles(styles)(DataTableHead)
