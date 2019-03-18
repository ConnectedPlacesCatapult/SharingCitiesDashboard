import React from "react";
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import ReplayIcon from '@material-ui/icons/Replay';
import PlusIcon from '@material-ui/icons/Add';

// redux
import { connect } from 'react-redux';
import {
  fetchImporterStatuses,
} from "./../../actions/adminActions";

import moment from 'moment'

const dummyData =
  [
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
  ]


const styles = (theme) => ({
  root: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    padding: `${theme.spacing.unit * 3}px`,
  },
  logsModal: {
    margin: theme.spacing.unit * 6,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    padding: `${theme.spacing.unit * 3}px`,
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: 48,
    float: "left",
  },
  table: {
    width: "100%"
  },
  headerButton: {
    float: "right"
  },
  tableTitleBar: {
  },
  tableTitle: {
    float: "left"
  },
  tableTitleActionButton: {
    width: '175px',
    float: "right"
  },
  actionButtonIcon: {
    marginRight: theme.spacing.unit,
  },
  stateContainer: {
    padding: 5
  },
  successState: {
    color: theme.palette.primary.main,
    fontWeight: 800
  },
  failureState: {
    color: theme.palette.secondary.main,
    fontWeight: 800
  },
  pendingState: {
    fontWeight: 800
  },
  modalHeader: {
    display: 'flex'
  },
  modalButtons: {
    marginTop: theme.spacing.unit * 2
  },
  logsContainer: {
    maxHeight: '60vh',
    overflowY: 'scroll',
    padding: '10px',
    borderRadius: '2px',
    background: '#222230'
  }
});

class ImportersList extends React.Component {
  constructor(props) {
    super(props);
    this.props.fetchImporterStatuses();
  }

  state = {
    logsModalOpen: false,
    selectedImporter: null
  };

  stateIndicator(state) {
    const { classes } = this.props;

    if (state === 'success') {
      return <div className={classes.successState}><Typography className={classes.successState}>Success</Typography></div>
    } else if (state === 'failure') {
      return <div className={classes.failureState}><Typography className={classes.failureState}>Failure</Typography></div>
    } else {
      return <div className={classes.pendingState}><Typography className={classes.pendingState}>Pending</Typography></div>
    }
  }

  handleOpenImporterLogs = (row) => {
    this.setState({
      logsModalOpen: true,
      selectedImporter: row
    })
  };

  handleImporterLogsClose = () => {
    this.setState({ logsModalOpen: false })
  };

  logsModalContent () {
    const { classes } = this.props;
    if (this.state.selectedImporter) {
      return (
        <Paper className={classes.logsModal}>
          <div className={classes.modalHeader}>
            <div style={{flex: 1}}>
              <Typography variant="h6" className={classes.loginPrompt} >
                {this.state.selectedImporter.api_id} | {this.state.selectedImporter.import_class_name}
              </Typography>
            </div>
            <div style={{flex: 1, textAlign: 'right'}}>
              <div className={classes.failureState}>
                <Typography variant="h6" className={classes.failureState}>Reason: {this.state.selectedImporter.reason}</Typography>
              </div>
            </div>
          </div>
          <hr/>
          <div className={classes.logsContainer}>
            <Typography>
              {this.state.selectedImporter.trace}
            </Typography>
          </div>
          <div className={classes.modalButtons}>
            <Button
              fullWidth
              variant="text"
              color="primary"
              className={classes.submit}
              onClick={this.handleImporterLogsClose}>
              Close
            </Button>
          </div>
        </Paper>
      )
    }
  }

  render() {
    const { classes, admin } = this.props;

    return (
      <div className={classes.root}>
        {/*Table*/}
        <Paper className={classes.paper}>
          <div className={classes.tableTitleBar}>
            <Typography variant="h5" color="primary" className={classes.tableTitle}>
              Importers
            </Typography>
            <Button variant="contained" color="primary" className={classes.tableTitleActionButton} onClick={this.props.handleOpenImporterLogs}>
              <ReplayIcon className={classes.actionButtonIcon}/>
              Retry All
            </Button>
          </div>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>API ID</TableCell>
                <TableCell align="right">Import Class Name</TableCell>
                <TableCell align="right">State</TableCell>
                <TableCell align="right">Reason</TableCell>
                <TableCell align="right">Timestamp</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyData.map(row => (
                <TableRow key={row.api_id}>
                  <TableCell component="th" scope="row">
                    {row.api_id}
                  </TableCell>
                  <TableCell align="right">
                    {row.import_class_name}
                  </TableCell>
                  <TableCell align="right">
                    {this.stateIndicator(row.state)}
                  </TableCell>
                  <TableCell align="right">
                    {row.reason}
                  </TableCell>
                  <TableCell align="right">
                    { moment(row.timestamp).format('HH:mm - D/MM/YY') }
                  </TableCell>
                  <TableCell align="right" style={{textAlign: 'right'}}>
                    {row.state === 'failure' ? <Button variant="text" size="small" fullWidth onClick={() => this.handleOpenImporterLogs(row)}>
                      View Logs
                    </Button> : null}
                  </TableCell>
                  <TableCell align="right" style={{textAlign: 'right'}}>
                    {row.state === 'failure' ? <IconButton onClick={() => promptDeleteUser(row)}>
                      <ReplayIcon color="primary" />
                    </IconButton> : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Modal
          open={this.state.logsModalOpen}
          onClose={this.handleImporterLogsClose}
          disableAutoFocus={true}
        >
          { this.logsModalContent() }
        </Modal>

      </div>
    )
  }
}

ImportersList.propTypes = {
  classes: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  admin: state.admin,
});

const mapDispatchToProps = (dispatch) => ({
  fetchImporterStatuses: () => dispatch(fetchImporterStatuses()),
});

ImportersList = withStyles(styles)(ImportersList);
ImportersList = connect(mapStateToProps, mapDispatchToProps)(ImportersList);

export default ImportersList
