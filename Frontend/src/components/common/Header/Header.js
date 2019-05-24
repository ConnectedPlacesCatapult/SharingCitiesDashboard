import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom'
import RegisterForm from './../../LoginPage/RegisterForm'

import {
  AppBar,
  ClickAwayListener,
  Button,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grow,
  MenuItem,
  MenuList,
  Modal,
  Paper,
  Popper,
  Switch,
  Toolbar,
  Typography,
  withStyles,
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { Logout as LogoutIcon } from 'mdi-material-ui';
import { connect } from 'react-redux';
import { logout, getUser, showChangePassword } from './../../../actions/userActions';
import { NavLink, withRouter } from 'react-router-dom';
import LoginForm from './../../LoginPage/LoginForm';

const FCC_CONFIG = require('./../../../../fcc.config');
const BG_IMAGE_SRC = require('./../../../images/Lisbon-logo-med.png');

const styles = (theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    margin: '30px 0',
    boxShadow: "none",
  },
  themeToggle: {
    position: 'absolute',
    top: `-${theme.spacing.unit}px`,
    left: 264,
    zIndex: theme.zIndex.drawer + 1,
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

  handleChangePassword = () => {
    const { showChangePassword } = this.props;
    showChangePassword();
  };

  showModal() {
    const {classes, user} = this.props;
    if (!user) {
      return <Redirect to='/login' />
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
    const { classes, location, user } = this.props;
    if (user && user.email) {
      return FCC_CONFIG.routes.map((route, i) => {
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
      <React.Fragment>
        <AppBar position="absolute" color="default" className={classes.root}>
          <Toolbar className={classes.toolbar} disableGutters>
            <img className={classes.logoImage} src={BG_IMAGE_SRC} width="220px" height="auto"/>
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
                        <MenuItem onClick={this.handleChangePassword}><LockIcon className={classes.menuIcon} />Change Password</MenuItem>
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
      </React.Fragment>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  getUser: () => dispatch(getUser()),
  showChangePassword: () => dispatch(showChangePassword()),
  logout: (props) => dispatch(logout(props)),
});

Header = withStyles(styles)(Header);
Header = withRouter(Header);
Header = connect(mapStateToProps, mapDispatchToProps)(Header);

export default Header
