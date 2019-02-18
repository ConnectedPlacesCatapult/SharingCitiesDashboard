import React from 'react';
import PropTypes from "prop-types";

import Widget from './Widget';

// material-ui
import { withStyles } from '@material-ui/core/styles';

// grid-layout
import RGL from "react-grid-layout";

// ToDo :: overwrite some of the original base styles
import './../../../node_modules/react-grid-layout/css/styles.css';
import './../../../node_modules/react-resizable/css/styles.css';
import './../../styles/gridLayoutCustoms.css';

// redux
import { connect } from 'react-redux';
import {
  fetchLayout,
  updateLayout,
  fetchWidgets,
} from "./../../actions/dashboardActions";

const styles = (theme) => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing.unit * 2,
  },
});

const ReactGridLayout = RGL;

class GridLayout extends React.Component {
  constructor(props) {
    super(props);

    this.onLayoutChange = this.onLayoutChange.bind(this);

    this.props.fetchLayout();
    this.props.fetchWidgets();
  }

  onLayoutChange(layout) {
    this.props.updateLayout(layout);
  }

  render() {
    const { classes, dashboard } = this.props;

    const gridItems = dashboard.layout.map((gridItem) => {
      let gridItemWidget = dashboard.widgets.find((widget) => gridItem.i === widget.i);

      return (
        <div key={gridItem.i}>
          <Widget {...gridItemWidget} isStatic={gridItem.static || false} />
        </div>
      )
    });

    return (
      <ReactGridLayout
        layout={dashboard.layout}
        cols={12}
        rowHeight={30}
        width={1200}
        onLayoutChange={this.onLayoutChange}
        className={classes.root}
        draggableHandle='.draggableHandle'
      >
        {gridItems}
      </ReactGridLayout>
    )
  }
}

GridLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  dashboard: PropTypes.object.isRequired,
  fetchLayout: PropTypes.func.isRequired,
  updateLayout: PropTypes.func.isRequired,
  fetchWidgets: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  dashboard: state.dashboard,
});

const mapDispatchToProps = (dispatch) => ({
  fetchLayout: () => dispatch(fetchLayout()),
  updateLayout: (layout) => dispatch(updateLayout(layout)),
  fetchWidgets: () => dispatch(fetchWidgets()),
});

GridLayout = withStyles(styles)(GridLayout);
GridLayout = connect(mapStateToProps, mapDispatchToProps)(GridLayout);

export default GridLayout
