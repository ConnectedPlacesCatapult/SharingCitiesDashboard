import React from 'react';
import PropTypes from 'prop-types';

import LoginForm from '../LoginPage/LoginForm';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import Modal from '@material-ui/core/Modal';
import { Logout as LogoutIcon } from 'mdi-material-ui'
import AccountIcon from '@material-ui/icons/AccountCircle';

// router
import {NavLink, withRouter} from "react-router-dom";

import { logout, getUser } from "../../actions/userActions";

// redux
import { connect } from 'react-redux';
import {fetchConfig} from "../../actions/configActions";

const FCC_CONFIG = require('./../../../../fcc.config');

const bgImage = require('./../../../images/Lisbon-logo-med.png');

const styles = (theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    margin: '30px 0',
    backgroundColor: theme.palette.primary.light,
    borderTop: 'solid 2px' + theme.palette.background.paper,
    borderBottom: 'solid 2px' + theme.palette.background.paper,
    boxShadow: "none",
  },
  logoImage: {
    position: 'absolute',
    left: '10px',
  },
  logoImageModal: {
    margin: 'auto'
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
    color: theme.palette.primary.dark,
    fontWeight: 'bold'
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
  userButton: {
    paddingTop: '20px',
    paddingBottom: '20px',
    fontWeight: "bold",
  },
  loginPrompt: {
    marginBottom: theme.spacing.unit,
    color: theme.palette.primary.light
  },
  loadingButton: {
    paddingTop: '0px',
    paddingBottom: '0px',
  },
  menuIcon: {
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
  progress: {
    margin: theme.spacing.unit * 2,
  },
  centerAlign: {
    textAlign: 'center',
  },
});

class Header extends React.Component {
  state = {
    loginModalOpen: false,
    open: false,
  };

  componentDidMount() {
    const { getUser } = this.props;
    getUser();
  }

  handleClick = event => {
    this.setState({ headerListEl: event.currentTarget });
  };

  handleModalOpen = () => {
    this.setState({ loginModalOpen: true });
  };

  // logOut = (e) =>  {
  //   e.preventDefault();
  //   doLogout(this.props)
  // }

  handleModalClose = () => {
    this.setState({ loginModalOpen: false });
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.headerList.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  };

  userMenu() {
      const {classes, user} = this.props;
      if (user && user.email) {
          return (
              <Button
                  buttonRef={node => {
                      this.headerList = node;
                  }}
                  aria-owns={open ? 'menu-list-grow' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleToggle}
                  className={classes.userButton}
              >
                  {user.fullname ? user.fullname : user.email}
              </Button>
          )
      } else {
        return (
          <CircularProgress size={20} className={classes.progress} />
        )
      }
  }

  showModal() {
    const {classes, user} = this.props;
    if (!user) {
      return (
        <Modal
          open={true}>
          <Paper className={classes.paper}>
            <div className={classes.centerAlign}>
              <img className={classes.logoImageModal} src={bgImage} width="220px" height="auto" style={{marginBottom: 20}}/>
              <Typography variant="h6" className={classes.loginPrompt} >
                Your session has expired
              </Typography>
              <Typography variant="h6">
                Please sign in again
              </Typography>
            </div>
            <LoginForm />
          </Paper>
        </Modal>
      )
    }
  }

  cards = () => {
    return data.map((card, i, imgArr) => {
      if (this.state.filter_selected === "all") {
        return data;
      } else if (card.filter === this.state.filter_selected) {
        return card;
      }
    });
  }

  renderPageLinks() {
    const { classes, location, config, user } = this.props;
    if (user && user.email) {
      return config.routes.map((route, i) => {
        // Hide links from non-admin users that require admin rights
        if (route.roles.indexOf("admin") !== -1 && user.admin || route.roles.indexOf("admin") === -1 ) {
          return <NavLink
            key={i}
            exact={route.exact}
            to={route.path}
            className={classes.link}
            activeClassName={classes.linkActive}
          >
            <Button className={classes.button} size="small">
              {
                location.pathname === route.path
                  ? <RadioButtonCheckedIcon className={classes.radioButton} color="secondary"/>
                  : <RadioButtonUncheckedIcon className={classes.radioButton} color="primary"/>
              }
              {route.name}
            </Button>
          </NavLink>
        }
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { open } = this.state;

    return (
      <AppBar position="absolute" color="default" className={classes.root}>
        <Toolbar className={classes.toolbar} disableGutters>
          <img className={classes.logoImage} src={bgImage} width="220px" height="auto"/>
          <Typography className={classes.toolbarTitle} variant="h4">
            &nbsp;
          </Typography>
          <div>
            {this.renderPageLinks()}
          </div>
            {this.userMenu()}
          <Popper open={open} anchorEl={this.headerList} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      <MenuItem disabled onClick={this.handleClose}><AccountIcon className={classes.menuIcon} />Profile</MenuItem>
                      <MenuItem onClick={() => this.props.logout(this.props)}><LogoutIcon className={classes.menuIcon} />Logout</MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          {this.showModal()}
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
  user: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  getUser: () => dispatch(getUser()),
  logout: (props) => dispatch(logout(props)),
});

Header = withStyles(styles)(Header);
Header = withRouter(Header);
Header = connect(mapStateToProps, mapDispatchToProps)(Header);

export default Header
