import React from 'react';
import PropTypes from 'prop-types';

// dialogs
import DetailDialog from './DetailDialog';
import AddLayerDialog from './AddLayerDialog';

// redux
import { connect } from 'react-redux';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import MenuItem from "@material-ui/core/MenuItem";

const styles = theme => ({
  root: {

  },
  button: {
    margin: theme.spacing.unit,
  },
});

class TempPage extends React.Component {
  state = {
    detailDialogOpen: false,
    addLayerDialogOpen: false,
  };

  handleDetailDialogOpen = () => {
    this.setState({ detailDialogOpen: true })
  };

  handleDetailDialogClose = () => {
    this.setState({ detailDialogOpen: false })
  };

  handleAddLayerDialogOpen = () => {
    this.setState({ addLayerDialogOpen: true })
  };

  handleAddLayerDialogClose = () => {
    this.setState({ addLayerDialogOpen: false })
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="subtitle1">Dialogs</Typography>
        <br />
        <IconButton
          onClick={this.handleDetailDialogOpen}
        >
          <AddIcon />
        </IconButton>
        <DetailDialog
          open={this.state.detailDialogOpen}
          onClose={this.handleDetailDialogClose}
        />


        <IconButton
          onClick={this.handleAddLayerDialogOpen}
        >
          <AddIcon />
        </IconButton>
        <AddLayerDialog
          open={this.state.addLayerDialogOpen}
          onClose={this.handleAddLayerDialogClose}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  config: state.config.config,
});

const mapDispatchToProps = (dispatch) => ({

});

TempPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

TempPage = withStyles(styles)(TempPage);
TempPage = connect(mapStateToProps, mapDispatchToProps)(TempPage);

export default TempPage
