import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import _ from "lodash";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";

import DataTableToolbar from './DataTableToolbar';
import DataTableHead from './DataTableHead';
import DataTableBody from './DataTableBody';
import DataTablePagination from './DataTablePagination';
import OptionsSidePanel from './OptionsSidePanel';


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    minWidth: 640,
  }
});

class DataTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: props.data.meta.order,
      orderBy: props.data.meta.orderBy,
      selected: [],
      data: props.data.data,
      page: 0,
      rowsPerPage: 10
    };
  }

  handleSelectAllClick = e => {
    if (e.target.checked) {
      this.setState(state => ({ selected: state.data.map((n, i) => i) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleClick = (id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (e, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = e => {
    this.setState({ rowsPerPage: e.target.value });
  };

  isSelected = (id) => {
    return _.indexOf(this.state.selected, id) !== -1;
  };

  render() {
    const { classes, data } = this.props;
    const { order, orderBy, selected, page, rowsPerPage } = this.state;

    return (
      <div className={classes.root}>
        <Paper>
          <DataTableToolbar
            numSelected={selected.length}
            sourceName={data.source}
          />
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <DataTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                columns={data.meta.columns}
                rowCount={data.data.length}
              />
              <DataTableBody
                data={data.data}
                columns={data.meta.columns}
                order={order}
                orderBy={orderBy}
                page={page}
                rowsPerPage={rowsPerPage}
                onClick={this.handleClick}
                isSelected={this.isSelected}
              />
            </Table>
          </div>
          <DataTablePagination
            data={data.data}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
        <OptionsSidePanel />
      </div>
    )
  }
}

DataTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  data: state.data,
});

const mapDispatchToProps = dispatch => ({

});

DataTable = withStyles(styles)(DataTable);
export default connect(mapStateToProps, mapDispatchToProps)(DataTable)
