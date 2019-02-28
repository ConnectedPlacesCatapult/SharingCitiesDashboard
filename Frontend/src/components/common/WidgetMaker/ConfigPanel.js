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
import { initializeEditor } from "./../../../actions/widgetActions";
import { saveWidget } from "./../../../actions/widgetActions";

// misc utils
import classNames from 'classnames';

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

ConfigPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  initializeEditor: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  initializeEditor: () => dispatch(initializeEditor()),
  saveWidget: () => dispatch(saveWidget()),
});

ConfigPanel = withStyles(styles)(ConfigPanel);
ConfigPanel = connect(mapStateToProps, mapDispatchToProps)(ConfigPanel);

export default ConfigPanel
