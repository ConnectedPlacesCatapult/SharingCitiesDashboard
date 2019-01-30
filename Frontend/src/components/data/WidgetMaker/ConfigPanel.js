import React from 'react';
import PropTypes from "prop-types";

import TypeSelector from './TypeSelector';

// material-ui
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

// redux
import { connect } from 'react-redux';
import { initializeEditor } from "./../../../actions/editorActions";

// misc utils
import classNames from 'classnames';
import Color from "color";

const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  paper: {
    //backgroundColor: Color(theme.palette.primary.dark).alpha(0.95).rgb().string(),
  },
  heading: {
    //color: 'white',
  },
  spacer: {
    margin: `${theme.spacing.unit}px 0`,
  },
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
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
        <Divider className={classes.spacer} />
        <Button
          className={classes.button}
          variant="contained"
          size="small"
        >
          Save Widget
          <SaveIcon className={classNames(classes.rightIcon, classes.iconSmall)} />
        </Button>
      </Paper>
    )
  }
}

ConfigPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  initializeEditor: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  initializeEditor: () => dispatch(initializeEditor()),
});

ConfigPanel = withStyles(styles)(ConfigPanel);
ConfigPanel = connect(mapStateToProps, mapDispatchToProps)(ConfigPanel);

export default ConfigPanel
