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
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PlusIcon from '@material-ui/icons/Add';

// redux
import { connect } from 'react-redux';
import {
  fetchUsers
} from "./../../actions/adminActions";
import { doUserDelete } from "../../actions/userActions";

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
});

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.props.fetchUsers();
  }

  render() {
    const { classes, admin } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <div className={classes.tableTitleBar}>
            <Typography variant="h4" color="primary" className={classes.tableTitle}>
              Users
            </Typography>
            <Button variant="contained" color="primary" className={classes.tableTitleActionButton} onClick={this.props.openAddUser}>
              <PlusIcon className={classes.actionButtonIcon}/>
              Add User
            </Button>
          </div>
          <Divider />
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Full Name</TableCell>
                <TableCell align="right">Admin</TableCell>
                <TableCell align="right">Activated</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admin.users.map(row => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="right">{row.email}</TableCell>
                  <TableCell align="right">{row.fullname}</TableCell>
                  <TableCell align="right">{row.admin ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="right">{row.activated ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="right" style={{textAlign: 'right'}}>
                    <IconButton onClick={() => { doUserDelete(row) }}>
                      <DeleteIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}

UserList.propTypes = {
  classes: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  admin: state.admin,
});

const mapDispatchToProps = (dispatch) => ({
  fetchUsers: () => dispatch(fetchUsers()),
});

UserList = withStyles(styles)(UserList);
UserList = connect(mapStateToProps, mapDispatchToProps)(UserList);

export default UserList
