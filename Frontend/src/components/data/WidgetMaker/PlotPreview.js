import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import VegaLite from 'react-vega-lite';
import { connect } from 'react-redux';

const styles = theme => ({
  root: {

  },
  widget: {

  },
});

class PlotPreview extends React.Component {
  render() {
    const { classes, editor } = this.props;

    const spec = {
      ...editor.plotConfig.spec,

    };

    return (
      <div className={classes.root}>
        <VegaLite
          spec={spec}
          data={editor.plotConfig.data}
        />
      </div>
    )
  }
}

PlotPreview.propTypes = {
  classes: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  editor: state.editor,
});

const mapDispatchToProps = dispatch => ({

});

PlotPreview = withStyles(styles)(PlotPreview);

export default connect(mapStateToProps, mapDispatchToProps)(PlotPreview)
