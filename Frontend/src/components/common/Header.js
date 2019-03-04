import React from 'react';
import PropTypes from 'prop-types';

import LoginForm from '../LoginPage/LoginForm';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import Modal from '@material-ui/core/Modal';
import { Login as LoginIcon } from 'mdi-material-ui'

// router
import {NavLink, withRouter} from "react-router-dom";

import { doLogout } from "../../actions/userActions";

// redux
import { connect } from 'react-redux';

// ToDo :: add this to config and define a default logo (somewhere)
const bgImage = require('./../../images/Lisbon-logo-med.png');

const styles = (theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    margin: '30px 0',
    //backgroundColor: theme.palette.primary.light,
    boxShadow: "none",
  },
  logoImage: {
    position: 'absolute',
    left: '10px',
  },
  toolbar: theme.mixins.toolbar,
  toolbarTitle: {
    flexGrow: 1,
    marginLeft: '24px',
  },
  button: {
    margin: theme.spacing.unit,
    width: theme.spacing.unit * 18,
    justifyContent: "left",
  },
  link: {
    textDecoration: 'none',
  },
  linkActive: {
    color: theme.palette.primary.dark,
  },
  radioButton: {
    marginRight: theme.spacing.unit,
  },
  loginButton: {
    paddingTop: '20px',
    paddingBottom: '20px',
    //backgroundColor: '#e3f6f4',
    textTransform: "none",
    fontWeight: "bold",
  },
  loginIcon: {
    marginRight: theme.spacing.unit,
  },
  paper: {
    position: 'absolute',
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: theme.spacing.unit * 50,
    //backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class Header extends React.Component {
  state = {
    loginModalOpen: false,
  };

  handleModalOpen = () => {
    this.setState({ loginModalOpen: true });
  };

  logOut = (e) =>  {
    e.preventDefault();
    doLogout(this.props)
  }

  handleModalClose = () => {
    this.setState({ loginModalOpen: false });
  };

  render() {
    const { classes, location, config } = this.props;

    const pageLinks = config.routes.map((route, i) => (
      <NavLink
        key={i}
        exact={route.exact}
        to={route.path}
        className={classes.link}
        activeClassName={classes.linkActive}
      >
        <Button className={classes.button} size="small">
          {
            location.pathname === route.path
              ? <RadioButtonCheckedIcon className={classes.radioButton} color="secondary" />
              : <RadioButtonUncheckedIcon className={classes.radioButton} color="primary" />
          }
          {route.name}
        </Button>
      </NavLink>
    ));

    return (
      <AppBar position="absolute" color="default" className={classes.root}>
        <Toolbar className={classes.toolbar} disableGutters>
          <img className={classes.logoImage} src={bgImage} width="220px" height="auto"/>
          <Typography className={classes.toolbarTitle} variant="h4">
            &nbsp;
          </Typography>
          <div>
            {pageLinks}
          </div>
          <Button className={classes.loginButton} onClick={this.logOut}>
            <LoginIcon className={classes.loginIcon} />
          </Button>
          <Modal
            open={this.state.loginModalOpen}
            onClose={this.handleModalClose}
          >
            <LoginForm />
          </Modal>
        </Toolbar>
      </AppBar>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.config,
});

const mapDispatchToProps = (dispatch) => ({

});

Header = withStyles(styles)(Header);
Header = withRouter(Header);
Header = connect(mapStateToProps, mapDispatchToProps)(Header);

export default Header
