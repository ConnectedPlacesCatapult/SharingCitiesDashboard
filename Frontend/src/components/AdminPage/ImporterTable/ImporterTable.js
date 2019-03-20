import React from 'react';
import PropTypes from 'prop-types';

import ImporterTableToolbar from './ImporterTableToolbar';
import ImporterTableHead from './ImporterTableHead';
import ImporterTableBody from './ImporterTableBody';
import ImporterTablePagination from './ImporterTablePagination';
import ImporterLogsModal from './ImporterLogsModal';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import Modal from "@material-ui/core/Modal";

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
    overflowY: 'scroll',
    maxHeight: '60vh',
  },
  table: {
    minWidth: 640,
  }
});

const DEFAULT_ORDER = 'desc';
const DEFAULT_ORDER_BY = 'Timestamp';

const api = [
  {
    "api_id": 1,
    "import_class_name": "GreenwichMeta",
    "state": "failure",
    "reason": "'latitude'",
    "trace": "Traceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/indexes/base.py\", line 2656, in get_loc\n    return self._engine.get_loc(key)\n  File \"pandas/_libs/index.pyx\", line 108, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/index.pyx\", line 132, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1601, in pandas._libs.hashtable.PyObjectHashTable.get_item\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1608, in pandas._libs.hashtable.PyObjectHashTable.get_item\nKeyError: 'latitude'\n\nDuring handling of the above exception, another exception occurred:\n\nTraceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/greenwich.py\", line 173, in _create_datasource\n    is_dependent=True)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/base.py\", line 153, in create_datasource\n    latitude = dataframe[location_tag.lat].tolist()\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/frame.py\", line 2927, in __getitem__\n    indexer = self.columns.get_loc(key)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/indexes/base.py\", line 2658, in get_loc\n    return self._engine.get_loc(self._maybe_cast_indexer(key))\n  File \"pandas/_libs/index.pyx\", line 108, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/index.pyx\", line 132, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1601, in pandas._libs.hashtable.PyObjectHashTable.get_item\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1608, in pandas._libs.hashtable.PyObjectHashTable.get_item\nKeyError: 'latitude'\n Traceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/indexes/base.py\", line 2656, in get_loc\n    return self._engine.get_loc(key)\n  File \"pandas/_libs/index.pyx\", line 108, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/index.pyx\", line 132, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1601, in pandas._libs.hashtable.PyObjectHashTable.get_item\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1608, in pandas._libs.hashtable.PyObjectHashTable.get_item\nKeyError: 'latitude'\n\nDuring handling of the above exception, another exception occurred:\n\nTraceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/greenwich.py\", line 173, in _create_datasource\n    is_dependent=True)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/base.py\", line 153, in create_datasource\n    latitude = dataframe[location_tag.lat].tolist()\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/frame.py\", line 2927, in __getitem__\n    indexer = self.columns.get_loc(key)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/indexes/base.py\", line 2658, in get_loc\n    return self._engine.get_loc(self._maybe_cast_indexer(key))\n  File \"pandas/_libs/index.pyx\", line 108, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/index.pyx\", line 132, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1601, in pandas._libs.hashtable.PyObjectHashTable.get_item\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1608, in pandas._libs.hashtable.PyObjectHashTable.get_item\nKeyError: 'latitude'\n Traceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/indexes/base.py\", line 2656, in get_loc\n    return self._engine.get_loc(key)\n  File \"pandas/_libs/index.pyx\", line 108, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/index.pyx\", line 132, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1601, in pandas._libs.hashtable.PyObjectHashTable.get_item\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1608, in pandas._libs.hashtable.PyObjectHashTable.get_item\nKeyError: 'latitude'\n\nDuring handling of the above exception, another exception occurred:\n\nTraceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/greenwich.py\", line 173, in _create_datasource\n    is_dependent=True)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/base.py\", line 153, in create_datasource\n    latitude = dataframe[location_tag.lat].tolist()\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/frame.py\", line 2927, in __getitem__\n    indexer = self.columns.get_loc(key)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/indexes/base.py\", line 2658, in get_loc\n    return self._engine.get_loc(self._maybe_cast_indexer(key))\n  File \"pandas/_libs/index.pyx\", line 108, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/index.pyx\", line 132, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1601, in pandas._libs.hashtable.PyObjectHashTable.get_item\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1608, in pandas._libs.hashtable.PyObjectHashTable.get_item\nKeyError: 'latitude'\n Traceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/indexes/base.py\", line 2656, in get_loc\n    return self._engine.get_loc(key)\n  File \"pandas/_libs/index.pyx\", line 108, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/index.pyx\", line 132, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1601, in pandas._libs.hashtable.PyObjectHashTable.get_item\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1608, in pandas._libs.hashtable.PyObjectHashTable.get_item\nKeyError: 'latitude'\n\nDuring handling of the above exception, another exception occurred:\n\nTraceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/greenwich.py\", line 173, in _create_datasource\n    is_dependent=True)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/base.py\", line 153, in create_datasource\n    latitude = dataframe[location_tag.lat].tolist()\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/frame.py\", line 2927, in __getitem__\n    indexer = self.columns.get_loc(key)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/indexes/base.py\", line 2658, in get_loc\n    return self._engine.get_loc(self._maybe_cast_indexer(key))\n  File \"pandas/_libs/index.pyx\", line 108, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/index.pyx\", line 132, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1601, in pandas._libs.hashtable.PyObjectHashTable.get_item\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1608, in pandas._libs.hashtable.PyObjectHashTable.get_item\nKeyError: 'latitude'\n Traceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/indexes/base.py\", line 2656, in get_loc\n    return self._engine.get_loc(key)\n  File \"pandas/_libs/index.pyx\", line 108, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/index.pyx\", line 132, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1601, in pandas._libs.hashtable.PyObjectHashTable.get_item\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1608, in pandas._libs.hashtable.PyObjectHashTable.get_item\nKeyError: 'latitude'\n\nDuring handling of the above exception, another exception occurred:\n\nTraceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/greenwich.py\", line 173, in _create_datasource\n    is_dependent=True)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/base.py\", line 153, in create_datasource\n    latitude = dataframe[location_tag.lat].tolist()\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/frame.py\", line 2927, in __getitem__\n    indexer = self.columns.get_loc(key)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/indexes/base.py\", line 2658, in get_loc\n    return self._engine.get_loc(self._maybe_cast_indexer(key))\n  File \"pandas/_libs/index.pyx\", line 108, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/index.pyx\", line 132, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1601, in pandas._libs.hashtable.PyObjectHashTable.get_item\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1608, in pandas._libs.hashtable.PyObjectHashTable.get_item\nKeyError: 'latitude'\n",
    "timestamp": "2019-03-14 15:23:44.886050"
  },
  {
    "api_id": 36678,
    "import_class_name": "GreenwichSiemens",
    "state": "failure",
    "reason": "'NoneType' object has no attribute 'replace'",
    "trace": "Traceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/greenwich.py\", line 541, in _create_datasource\n    super()._create_datasource(headers)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/base.py\", line 67, in _create_datasource\n    _, status_code = self.load_dataset(headers)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/base.py\", line 87, in load_dataset\n    data = requests.get((self.url).replace(' ', '').replace('\\n', '') + self.api_key, headers=headers)\nAttributeError: 'NoneType' object has no attribute 'replace'\n",
    "timestamp": "2019-03-14 15:23:43.912776"
  },
  {
    "api_id": 35677,
    "import_class_name": "GreenwichOCC_2",
    "state": "failure",
    "reason": "'NoneType' object has no attribute 'replace'",
    "trace": "Traceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/greenwich.py\", line 335, in _create_datasource\n    super()._create_datasource(headers)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/base.py\", line 67, in _create_datasource\n    _, status_code = self.load_dataset(headers)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/base.py\", line 87, in load_dataset\n    data = requests.get((self.url).replace(' ', '').replace('\\n', '') + self.api_key, headers=headers)\nAttributeError: 'NoneType' object has no attribute 'replace'\n",
    "timestamp": "2019-03-14 15:23:43.913869"
  },
  {
    "api_id": 35442,
    "import_class_name": "GreenwichKiwiPump",
    "state": "failure",
    "reason": "'NoneType' object has no attribute 'replace'",
    "trace": "Traceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/greenwich.py\", line 418, in _create_datasource\n    super()._create_datasource(headers)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/base.py\", line 67, in _create_datasource\n    _, status_code = self.load_dataset(headers)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/base.py\", line 87, in load_dataset\n    data = requests.get((self.url).replace(' ', '').replace('\\n', '') + self.api_key, headers=headers)\nAttributeError: 'NoneType' object has no attribute 'replace'\n",
    "timestamp": "2019-03-14 15:23:43.915831"
  },
  {
    "api_id": 35676,
    "import_class_name": "GreenwichMeta_2",
    "state": "failure",
    "reason": "'NoneType' object has no attribute 'replace'",
    "trace": "Traceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/greenwich.py\", line 287, in _create_datasource\n    super()._create_datasource(headers)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/base.py\", line 67, in _create_datasource\n    _, status_code = self.load_dataset(headers)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/base.py\", line 87, in load_dataset\n    data = requests.get((self.url).replace(' ', '').replace('\\n', '') + self.api_key, headers=headers)\nAttributeError: 'NoneType' object has no attribute 'replace'\n",
    "timestamp": "2019-03-14 15:23:43.916974"
  },
  {
    "api_id": 2,
    "import_class_name": "GreenwichOCC",
    "state": "failure",
    "reason": "'lotcode'",
    "trace": "Traceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/indexes/base.py\", line 2656, in get_loc\n    return self._engine.get_loc(key)\n  File \"pandas/_libs/index.pyx\", line 108, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/index.pyx\", line 132, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1601, in pandas._libs.hashtable.PyObjectHashTable.get_item\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1608, in pandas._libs.hashtable.PyObjectHashTable.get_item\nKeyError: 'lotcode'\n\nDuring handling of the above exception, another exception occurred:\n\nTraceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/greenwich.py\", line 213, in _create_datasource\n    names = self.df['lotcode'].tolist()\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/frame.py\", line 2927, in __getitem__\n    indexer = self.columns.get_loc(key)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/lib/python3.7/site-packages/pandas/core/indexes/base.py\", line 2658, in get_loc\n    return self._engine.get_loc(self._maybe_cast_indexer(key))\n  File \"pandas/_libs/index.pyx\", line 108, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/index.pyx\", line 132, in pandas._libs.index.IndexEngine.get_loc\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1601, in pandas._libs.hashtable.PyObjectHashTable.get_item\n  File \"pandas/_libs/hashtable_class_helper.pxi\", line 1608, in pandas._libs.hashtable.PyObjectHashTable.get_item\nKeyError: 'lotcode'\n",
    "timestamp": "2019-03-14 15:23:44.848081"
  },
  {
    "api_id": 5,
    "import_class_name": "MilanAPI",
    "state": "success",
    "reason": "",
    "trace": "",
    "timestamp": "2019-03-14 15:23:51.643088"
  },
  {
    "api_id": 3,
    "import_class_name": "KCLAirQuality",
    "state": "success",
    "reason": "",
    "trace": "",
    "timestamp": "2019-03-14 15:23:55.736983"
  },
  {
    "api_id": 4,
    "import_class_name": "TfL_BikePoints",
    "state": "failure",
    "reason": "'BikePoints_545'",
    "trace": "Traceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/tfl_bike_points.py\", line 46, in _create_datasource\n    description_tag='sourceSystemKey', api_timestamp_tag='modified')\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/base.py\", line 248, in create_datasource_with_values\n    api_timestamp_tag, value_tag, attribute_tag, unit_value_tag)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/base.py\", line 492, in insert_data\n    sensor_id = sensor_objects[sensor_prefix + str(sensor_name)].id\nKeyError: 'BikePoints_545'\n",
    "timestamp": "2019-03-14 15:24:03.787294"
  },
  {
    "api_id": 35443,
    "import_class_name": "GreenwichWholeHouse",
    "state": "failure",
    "reason": "'NoneType' object has no attribute 'replace'",
    "trace": "Traceback (most recent call last):\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/greenwich.py\", line 473, in _create_datasource\n    super()._create_datasource(headers)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/base.py\", line 67, in _create_datasource\n    _, status_code = self.load_dataset(headers)\n  File \"/Users/keatonpennels/Documents/FCC/Production/FCCenv/ImporterStatus/Analytics/importers/base.py\", line 87, in load_dataset\n    data = requests.get((self.url).replace(' ', '').replace('\\n', '') + self.api_key, headers=headers)\nAttributeError: 'NoneType' object has no attribute 'replace'\n",
    "timestamp": "2019-03-14 15:23:43.894011"
  },
];

const columns = [
  {id: "timestamp", label: "Last Updated", numeric: false},
  {id: "api_id", label: "API ID", numeric: true},
  {id: "import_class_name", label: "Class Name", numeric: false},
  {id: "state", label: "State", numeric: false},
  {id: "reason", label: "Reason", numeric: false},
  // {id: "trace", label: "trace", numeric: false},
]

class ImporterTable extends React.Component {
  constructor(props) {
    super(props);

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

  handleSelectAllClick = (e) => {
    if (e.target.checked) {
      this.setState({ selected: api.map((n, i) => i) });
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

  handleBulkRerunClick = () => {
    console.log('bulk rerun clicked')
  };

  handleRerunClick = (selectedRerun) => {
    console.log('selectedRerun', selectedRerun)
  };

  handleChangeRowsPerPage = (e) => {
    this.setState({ rowsPerPage: e.target.value })
  };

  isSelected = (id) => {
    return this.state.selected.includes(id)
  };

  render() {
    const { classes } = this.props;
    const { order, orderBy, selected, page, rowsPerPage } = this.state;

    // const columns = this.generateColumnsFromData();

    return (
      <div className={classes.root}>
        <Paper>
          <ImporterTableToolbar
            numSelected={selected.length}
            onRerunClick={this.handleBulkRerunClick}
          />
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <ImporterTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                columns={columns}
                rowCount={api.length}
              />
              <ImporterTableBody
                data={api}
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
            data={api}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>

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
};

const mapStateToProps = (state) => ({
  api: state.api,
});

const mapDispatchToProps = (dispatch) => ({

});

ImporterTable = withStyles(styles)(ImporterTable);
ImporterTable = connect(mapStateToProps, mapDispatchToProps)(ImporterTable);

export default ImporterTable
