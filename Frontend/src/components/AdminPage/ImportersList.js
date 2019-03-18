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
              {admin.importers.map(row => (
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
