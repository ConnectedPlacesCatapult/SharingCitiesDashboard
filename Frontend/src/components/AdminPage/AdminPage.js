import React from "react";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import Header from './../common/Header';
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import Modal from "@material-ui/core/Modal";
import UserList from "./UserList"
import AddUser from "../common/AddUser/AddUser"

// material-ui
import { withStyles } from '@material-ui/core/styles';

// redux
import { connect } from 'react-redux';

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
    const { classes, location } = this.props;

    return (
      <div className={classes.root}>
        <Header location={location} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <UserList openAddUser={this.openAddUser}/>
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
});

const mapDispatchToProps = (dispatch) => ({
});

AdminPage = withStyles(styles)(AdminPage);
AdminPage = connect(mapStateToProps, mapDispatchToProps)(AdminPage);

export default AdminPage
