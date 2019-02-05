import React from 'react';
import PropTypes from 'prop-types';

import DataTableToolbar from './DataTableToolbar';
import DataTableHead from './DataTableHead';
import DataTableBody from './DataTableBody';
import DataTablePagination from './DataTablePagination';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";

// redux
import { connect } from 'react-redux';

const styles = (theme) => ({
  root: {
    // width: '70%',
    // marginTop: theme.spacing.unit * 3,
    // float: 'left',
    flexGrow: 1,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    minWidth: 640,
  }
});

const DEFAULT_ORDER = 'desc';
const DEFAULT_ORDER_BY = 'Timestamp';

class DataTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: DEFAULT_ORDER,
      orderBy: DEFAULT_ORDER_BY,
      selected: [],
      page: 0,
      rowsPerPage: 10,
    };
  }

  generateColumnsFromData = () => {
    const { data } = this.props;

    if (!data.data.length) return [];

    let columns = [];
    Object.keys(data.data[0]).forEach((key) => {
      columns = [...columns, {
        id: key,
        label: key,
        numeric: Number.isInteger(data.data[0][key]),
      }]
    });

    return columns;
  };

  handleSelectAllClick = (e) => {
    if (e.target.checked) {
      this.setState({ selected: this.props.data.data.map((n, i) => i) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleRequestSort = (e, property) => {
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
    this.setState({ page })
  };

  handleChangeRowsPerPage = (e) => {
    this.setState({ rowsPerPage: e.target.value })
  };

  isSelected = (id) => {
    return this.state.selected.includes(id)
  };

  render() {
    const { classes, data, themes } = this.props;
    const { order, orderBy, selected, page, rowsPerPage } = this.state;

    const currentTheme = themes.find((theme) => theme.id === data.query.themeId);
    const currentSubtheme = currentTheme.subthemes.find((subtheme) => subtheme.id === data.query.subthemeId);
    const columns = this.generateColumnsFromData();

    return (
      <div className={classes.root}>
        <Paper>
          <DataTableToolbar
            numSelected={selected.length}
            subthemeName={currentSubtheme.name}
          />
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <DataTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                columns={columns}
                rowCount={data.data.length}
              />
              <DataTableBody
                data={data.data}
                columns={columns}
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
      </div>
    )
  }
}

DataTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  themes: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
  themes: state.themes.themes,
});

const mapDispatchToProps = (dispatch) => ({

});

DataTable = withStyles(styles)(DataTable);
DataTable = connect(mapStateToProps, mapDispatchToProps)(DataTable);

export default DataTable
