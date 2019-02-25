import React from "react";
import PropTypes from 'prop-types';

import WidgetMaker from '../common/WidgetMaker/index';
import DataTable from '../DataPage/DataTable/index';
import OptionsSidePanel from '../DataPage/OptionsSidePanel';
import NoData from '../DataPage/NoData';
import LoginForm from '../LoginPage/LoginForm'
import RegisterForm from '../LoginPage/RegisterForm'

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

// redux
import { connect } from 'react-redux';

const styles = (theme) => ({
  root: {
    display: 'flex',
    clear: 'both',
  },
  content: {
    flexGrow: 1,
    //backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  appBarSpacer: theme.mixins.toolbar,
  flexWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing.unit * 3,
  },
});

class LoginPage extends React.Component {
  state = {
    widgetModalOpen: false,
    showLogin: true,
  };

  openWidgetMaker = () => {
    this.setState({ widgetModalOpen: true })
  };

  handleWidgetMakerClose = () => {
    this.setState({ widgetModalOpen: false })
  };

  toggleForm = () => {
    console.log('toggled')
    this.setState({ showLogin: !this.state.showLogin });
  }

  renderForm() {
    if (this.state.showLogin === true) {
      return (
        <LoginForm onToggleForm={this.toggleForm}/>
      )
    } else {
      return (
        <RegisterForm onToggleForm={this.toggleForm}/>
      )
    }
  }

  render() {
    const { classes, location, api } = this.props;

    return (
      <div className={classes.root}>
        <main className={classes.content}>
          { this.renderForm() }
        </main>
      </div>
    )
  }
}

function toggleForm() {
  console.log('form toggled')
}
//
// function renderForm(showLogin) {
//   if (showLogin) {
//     return (
//       <LoginForm onToggleForm={this.toggleForm}/>
//     )
//   } else {
//     return (
//       <RegisterForm/>
//     )
//   }
// }

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  api: state.api,
});

const mapDispatchToProps = (dispatch) => ({

});

LoginPage = withStyles(styles)(LoginPage);
LoginPage = connect(mapStateToProps, mapDispatchToProps)(LoginPage);

export default LoginPage
