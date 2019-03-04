import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Button,
  Divider,
  Paper,
  Typography,
  withStyles,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { connect } from 'react-redux';
import { initializeEditor } from "./../../../actions/widgetActions";
import { saveWidget } from "./../../../actions/widgetActions";
import TypeSelector from './TypeSelector';

const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  spacer: {
    margin: `${theme.spacing.unit * 2}px 0`,
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

  static propTypes = {
    classes: PropTypes.object.isRequired,
    initializeEditor: PropTypes.func.isRequired,
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Typography variant="h6">Widget Creator</Typography>
        <TypeSelector />
        <Divider className={classes.spacer} />
        <Button
          variant="contained"
          size="small"
          onClick={this.props.saveWidget}
        >
          Save Widget
          <SaveIcon className={classNames(classes.rightIcon, classes.iconSmall)} />
        </Button>
      </Paper>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  initializeEditor: () => dispatch(initializeEditor()),
  saveWidget: () => dispatch(saveWidget()),
});

ConfigPanel = withStyles(styles)(ConfigPanel);
ConfigPanel = connect(null, mapDispatchToProps)(ConfigPanel);

export default ConfigPanel
