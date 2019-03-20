import React from "react";
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// redux
import { connect } from 'react-redux';
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
  },
  emptyList: {
    marginTop: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.primary.main,
  }
});

class UserLogsModal extends React.Component {
  constructor(props) {
    super(props);
  }

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
  
  handleUserLogsClose = () => {
    this.setState({ logsModalOpen: false })
  };
  
  render() {
    const { classes, admin } = this.props;

    return (
      <Paper className={classes.logsModal}>
        <div className={classes.modalHeader}>
          <div style={{flex: 1}}>
            <Typography variant="h6" className={classes.loginPrompt} >
              {this.props.selectedUser.api_id} | {this.props.selectedUser.import_class_name}
            </Typography>
          </div>
          <div style={{flex: 1, textAlign: 'right'}}>
            <div className={classes.failureState}>
              <Typography variant="h6" className={classes.failureState}>Reason: {this.props.selectedUser.reason}</Typography>
            </div>
          </div>
        </div>
        <hr/>
        <div className={classes.logsContainer}>
          <Typography>
            {this.props.selectedUser.trace}
          </Typography>
        </div>
        <div className={classes.modalButtons}>
          <Button
            fullWidth
            variant="text"
            color="primary"
            className={classes.submit}
            onClick={this.props.onCloseClick}>
            Close
          </Button>
        </div>
      </Paper>
    )
  }
}

UserLogsModal.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedUser: PropTypes.object.isRequired,
  onCloseClick: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

UserLogsModal = withStyles(styles)(UserLogsModal);
UserLogsModal = connect(mapStateToProps, mapDispatchToProps)(UserLogsModal);

export default UserLogsModal
