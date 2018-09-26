import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { lighten } from "../../../node_modules/@material-ui/core/styles/colorManipulator";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import DeleteIcon from '@material-ui/icons/Delete';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import IconButton from '@material-ui/core/IconButton';
import Widgets from './Widgets';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import SettingsIcon from "@material-ui/icons/Settings";

const styles = theme => ({
  card: {
    minWidth: 275,
  },
  header: {
    backgroundColor: lighten(theme.palette.primary.light, 0.6),
    borderBottom: '1px solid ' + theme.palette.primary.main,
  },
  actions: {
    display: 'flex',
    backgroundColor: lighten(theme.palette.primary.light, 0.6),
    borderTop: '1px solid ' + theme.palette.primary.main,
    paddingBottom: '29px',
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Widget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteDialogOpen: false,
    };
  }

  handleDeleteClicked = () => {
    this.props.onDelete(this.props.i);
  };

  deleteWidget = () => {
    this.handleCloseDeleteDialog();
    this.handleDeleteClicked();
  };

  handleClickDelete = () => {
    this.setState({ deleteDialogOpen: true });
  };

  handleCloseDeleteDialog = () => {
    this.setState({ deleteDialogOpen: false });
  };

  render() {
    const { children, classes, className, component, data, name, style } = this.props;
    const { deleteDialogOpen } = this.state;

    const WidgetComponent = Widgets[component];

    return (
      <Card className={className + ' widget ' + classes.card} style={style}>
        <CardHeader
          className={classes.header}
          title={name}
        />
        <CardContent>
          <WidgetComponent data={data} />
        </CardContent>
        <CardActions className={classes.actions}>
          <IconButton color="primary">
            <DeleteIcon onClick={this.handleClickDelete} />
          </IconButton>
          <IconButton onClick={this.handleOpen} color="secondary">
            <SettingsIcon />
          </IconButton>
          <IconButton color="inherit" size="small">
            <OpenWithIcon
              className="react-grid-item-drag-handle"
              onMouseDown={this.props.onMouseDown}
              onMouseUp={this.props.onMouseUp}
              onTouchStart={this.props.onTouchStart}
              onTouchEnd={this.props.onTouchEnd}
            />
          </IconButton>
          <DeleteDialog open={deleteDialogOpen} handleClickNo={this.handleCloseDeleteDialog} handleClickYes={this.deleteWidget} />
        </CardActions>
        {children}
      </Card>
    )
  }
}

Widget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Widget);

class DeleteDialog extends Component {
  render() {
    const { open, handleClickNo, handleClickYes } = this.props;

    return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete this Widget?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting this Widget is permanent
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickNo} color="primary">
            Disagree
          </Button>
          <Button onClick={handleClickYes} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}