import React from "react";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import Header from './../common/Header';
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import Modal from "@material-ui/core/Modal";
import UserList from "./UserList"
import AddUser from "../common/AddUser/AddUser"
import DeleteUserDialog from "../common/DeleteUserDialog/DeleteUserDialog"

// material-ui
import { withStyles } from '@material-ui/core/styles';

// redux
import { connect } from 'react-redux';
import { promptDeleteUser } from "../../actions/adminActions";
import { deleteUser } from "../../actions/adminActions";
import { cancelDeleteUser } from "../../actions/adminActions";

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 4,
    height: '100vh',
    overflow: 'auto'
  },
  appBarSpacer: theme.mixins.toolbar,
});

class AdminPage extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    addUserModalOpen: false,
  };

  openAddUser = () => {
    this.setState({ addUserModalOpen: true })
  };

  handleAddUserClose = () => {
    this.setState({ addUserModalOpen: false })
  };

  render() {
    const { classes, location, admin } = this.props;

    return (
      <div className={classes.root}>
        <Header location={location} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <UserList openAddUser={this.openAddUser}/>
          <Dialog
            open={admin.deleteUserDialogOpen}
            onClose={this.props.cancelDeleteUser}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DeleteUserDialog cancelDelete={this.props.cancelDeleteUser} deleteUser={this.props.deleteUser}/>
          </Dialog>
        </main>
        <Modal
          open={this.state.addUserModalOpen}
          onClose={this.handleAddUserClose}
          disableAutoFocus={true}
        >
          <AddUser closeAddUser={this.handleAddUserClose}/>
        </Modal>
      </div>
    )
  }
}

AdminPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  admin: state.admin
});

const mapDispatchToProps = (dispatch) => ({
  promptDeleteUser: () => dispatch(promptDeleteUser()),
  deleteUser: () => dispatch(deleteUser()),
  cancelDeleteUser: () => dispatch(cancelDeleteUser()),
});

AdminPage = withStyles(styles)(AdminPage);
AdminPage = connect(mapStateToProps, mapDispatchToProps)(AdminPage);

export default AdminPage
