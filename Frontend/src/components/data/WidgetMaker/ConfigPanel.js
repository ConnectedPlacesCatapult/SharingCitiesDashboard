import React from 'react';
import PropTypes from "prop-types";
import classNames from 'classnames';
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';
import Color from "color";
import { connect } from 'react-redux';
import { initializeEditor} from "./../../../actions/editorActions";

import TypeSelector from './TypeSelector';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  paper: {
    backgroundColor: Color(theme.palette.primary.dark).alpha(0.95).rgb().string(),
  },
  heading: {
    color: 'white',
  },
});

class ConfigPanel extends React.Component {
  constructor(props) {
    super(props);

    props.initializeEditor();
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classNames(classes.root, classes.paper)}>
        <Typography variant="h6" className={classes.heading}>
          Widget Creator
        </Typography>
        <TypeSelector />
      </Paper>
    )
  }
}

ConfigPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  initializeEditor: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  initializeEditor: () => dispatch(initializeEditor()),
});

ConfigPanel = withStyles(styles)(ConfigPanel);

export default connect(mapStateToProps, mapDispatchToProps)(ConfigPanel)
