import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import { connect } from 'react-redux';

const styles = theme => ({
  root: {

  },
  widgetTypeSelector: {
    display: 'flex',
  },
});

class TypeSelector extends React.Component {


  render() {
    const { classes, data } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.widgetTypeSelector}>
          <Button >
            Chart
          </Button>
          <Button >
            Map
          </Button>
        </div>
      </div>
    )
  }
}

TypeSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  editor: state.editor,
});

const mapDispatchToProps = dispatch => ({

});

TypeSelector = withStyles(styles)(TypeSelector);

export default connect(mapStateToProps, mapDispatchToProps)(TypeSelector)
