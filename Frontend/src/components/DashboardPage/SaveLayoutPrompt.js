import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {saveLayout, dismissSaveLayout} from "../../actions/dashboardActions";
import {connect} from "react-redux";

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
    marginLeft: theme.spacing.unit * 2,
  },
  darkSnackBar: {
    backgroundColor: '#212121'
  },
  message: {
    color: "white"
  }
});

class SaveLayoutPrompt extends React.Component {
  state = {
    open: this.props.open,
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  };

  handleSave = () => {
    this.props.saveLayout()
  };

  render() {
    const { classes, location, dashboard } = this.props;
    return (
      <div>
        <Snackbar
          variant="primary"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={dashboard.layoutChanged > 1}
          autoHideDuration={6000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}>
          <SnackbarContent message={<span id="message-id" className={classes.message}>Layout Changed</span>}
                           className={classes.darkSnackBar} action={[
            <Button key="save" variant="contained" color="primary" size="small"
                    onClick={this.handleSave}>
              SAVE NEW LAYOUT
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="default"
              className={classes.close}
              onClick={this.props.dismissSaveLayout}
            >
              <CloseIcon/>
            </IconButton>,
          ]}/>
        </Snackbar>
      </div>
    );
  }
}

SaveLayoutPrompt.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dashboard: state.dashboard,
});

const mapDispatchToProps = (dispatch) => ({
  saveLayout: () => dispatch(saveLayout()),
  dismissSaveLayout: () => dispatch(dismissSaveLayout()),
});

SaveLayoutPrompt = withStyles(styles)(SaveLayoutPrompt);
SaveLayoutPrompt = connect(mapStateToProps, mapDispatchToProps)(SaveLayoutPrompt);

export default SaveLayoutPrompt