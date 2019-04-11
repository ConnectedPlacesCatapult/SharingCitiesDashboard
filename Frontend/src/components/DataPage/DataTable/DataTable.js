import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  withStyles,
} from '@material-ui/core';
import DataTableToolbar from './DataTableToolbar';
import DataTableHead from './DataTableHead';
import DataTableBody from './DataTableBody';
import DataTablePagination from './DataTablePagination';

const FCC_CONFIG = require('./../../../../fcc.config');

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    minWidth: 640,
  }
});

class DataTable extends React.Component {
  state = {
    order: FCC_CONFIG.dataTableDefaults.order,
    orderBy: FCC_CONFIG.dataTableDefaults.orderBy,
    page: 0,
    rowsPerPage: FCC_CONFIG.dataTableDefaults.rowsPerPage,
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  handleRequestSort = (e, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (e, page) => {
    this.setState({ page })
  };

  handleChangeRowsPerPage = (e) => {
    this.setState({ rowsPerPage: e.target.value })
  };

  render() {
    const { classes } = this.props;
    const { order, orderBy, page, rowsPerPage } = this.state;

    const columns = [
      {
        id: 'Name',
        label: 'Sensor',
        numeric: false,
      },
      {
        id: 'Value',
        label: `Value (${this.props['Attribute_Unit_Value']})`,
        numeric: true,
      },
      {
        id: 'Timestamp',
        label: 'Timestamp',
        numeric: true,
      },
    ];

    return (
      <div className={classes.root}>
        <DataTableToolbar
          attributeName={this.props['Attribute_Name']}
          attributeDescription={this.props['Attribute_Description']}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <DataTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={this.props['Attribute_Values'].length}
              columns={columns}
            />
            <DataTableBody
              data={this.props['Attribute_Values']}
              columns={columns}
              order={order}
              orderBy={orderBy}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          </Table>
        </div>
        <DataTablePagination
          data={this.props['Attribute_Values']}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </div>
    )
  }
}

DataTable = withStyles(styles)(DataTable);

export default DataTable
