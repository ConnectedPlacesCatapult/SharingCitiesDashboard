import React from 'react';
import PropTypes from 'prop-types';

import ImporterTableHead from './ImporterTableHead';
import ImporterTableBody from './ImporterTableBody';
import ImporterTablePagination from './ImporterTablePagination';
import ImporterLogsModal from './ImporterLogsModal';
import SearchIcon from '@material-ui/icons/Search';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

// redux
import { connect } from 'react-redux';
import { rerunImporter, fetchImporterStatuses } from "../../../actions/adminActions";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  tableWrapper: {
    overflowX: 'auto',
    overflowY: 'scroll',
    maxHeight: '70vh',
  },
  table: {
    minWidth: 640,
  },
  noData: {
    textAlign: 'center'
  },
  noDataMessage: {
    textAlign: 'center',
    marginBottom: theme.spacing.unit * 2,
  },
  noDataIcon: {
    marginTop: theme.spacing.unit * 2,
    textAlign: 'center',
    width: '100%'
  }
});

const DEFAULT_ORDER = 'desc';
const DEFAULT_ORDER_BY = 'Timestamp';

const columns = [
  {id: "timestamp", label: "Last Updated", numeric: false},
  {id: "api_id", label: "API ID", numeric: true},
  {id: "import_class_name", label: "Class Name", numeric: false},
  {id: "state", label: "State", numeric: false},
  {id: "reason", label: "Reason", numeric: false},
]

class ImporterTable extends React.Component {
  constructor(props) {
    super(props);
    this.props.fetchImporterStatuses();
    this.state = {
      order: DEFAULT_ORDER,
      orderBy: DEFAULT_ORDER_BY,
      selected: [],
      page: 0,
      rowsPerPage: 10,
      importerLogsModalOpen: false,
      selectedImporter: {}
    };
  }

  handleRequestSort = (e, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleImporterLogsOpen = (selectedImporter) => {
    this.setState({ selectedImporter });
    this.setState({ importerLogsModalOpen: true });
  };

  handleImporterLogsClose = () => {
    this.setState({ importerLogsModalOpen: false });
  };

  handleChangePage = (e, page) => {
    this.setState({ page })
  };

  handleRerunClick = (selectedRerun) => {
    this.props.rerunImporter(selectedRerun)
  };

  handleChangeRowsPerPage = (e) => {
    this.setState({ rowsPerPage: e.target.value })
  };

  isSelected = (id) => {
    return this.state.selected.includes(id)
  };

  render() {
    const { classes, admin } = this.props;
    const { order, orderBy, selected, page, rowsPerPage } = this.state;

    return (
      <div className={classes.root}>
        {
          admin.importers && admin.importers.length > 0
            ? <Paper>
                <div className={classes.tableWrapper}>
                  <Table className={classes.table} aria-labelledby="tableTitle">
                    <ImporterTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={this.handleRequestSort}
                      columns={columns}
                      rowCount={admin.importers.length}
                    />
                    <ImporterTableBody
                      data={admin.importers}
                      columns={columns}
                      order={order}
                      orderBy={orderBy}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      onClick={this.handleClick}
                      onLogsClick={this.handleImporterLogsOpen}
                      onRerunClick={this.handleRerunClick}
                      isSelected={this.isSelected}
                    />
                  </Table>
                </div>
                <ImporterTablePagination
                  data={admin.importers}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
            : <Paper>
              <div className={classes.tableWrapper}>
                <Typography variant="subtitle1" color="primary" className={classes.noDataMessage}>
                  <SearchIcon className={classes.noDataIcon}/>
                  Problem loading importers
                </Typography>
              </div>
            </Paper>
        }
        <Modal
          open={this.state.importerLogsModalOpen}
          onClose={this.handleImporterLogsClose}
          disableAutoFocus={true}
        >
          <ImporterLogsModal selectedImporter={this.state.selectedImporter} onCloseClick={this.handleImporterLogsClose}></ImporterLogsModal>
        </Modal>

      </div>
    )
  }
}

ImporterTable.propTypes = {
  classes: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
  rerunImporter: PropTypes.func.isRequired,
  admin: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  api: state.api,
  admin: state.admin,
});

const mapDispatchToProps = (dispatch) => ({
  rerunImporter: (importer) => dispatch(rerunImporter(importer)),
  fetchImporterStatuses: () => dispatch(fetchImporterStatuses()),
});

ImporterTable = withStyles(styles)(ImporterTable);
ImporterTable = connect(mapStateToProps, mapDispatchToProps)(ImporterTable);

export default ImporterTable
