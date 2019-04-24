import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import {
  fetchLayout,
  updateLayout,
  fetchWidgets,
} from './../../actions/dashboardActions';
import RGL from 'react-grid-layout';
import AlertWidget from './../Widget/AlertWidget';
import ForecastWidget from './../Widget/ForecastWidget';
import MapWidget from './../Widget/MapWidget';
import PlotWidget from './../Widget/PlotWidget';

import './../../../node_modules/react-grid-layout/css/styles.css';
import './../../../node_modules/react-resizable/css/styles.css';

const ReactGridLayout = RGL;

const styles = (theme) => ({
  gridLayout: {
    display: 'flex',
    marginTop: theme.spacing.unit * 2,
  },
});

class GridLayout extends React.Component {
  static propTypes = {
    dashboard: PropTypes.object.isRequired,
    fetchLayout: PropTypes.func.isRequired,
    updateLayout: PropTypes.func.isRequired,
    fetchWidgets: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onLayoutChange = this.onLayoutChange.bind(this);

    this.props.fetchWidgets();
    this.props.fetchLayout();
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
          {gridItemWidget.type === 'alert' && <AlertWidget {...gridItemWidget} />}
          {gridItemWidget.type === 'forecast' && <ForecastWidget {...gridItemWidget} />}
          {gridItemWidget.type === 'map' && <MapWidget {...gridItemWidget} />}
          {gridItemWidget.type === 'plot' && <PlotWidget {...gridItemWidget} />}
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
        className={classes.gridLayout}
        draggableHandle='.draggableHandle'
      >
        {gridItems}
      </ReactGridLayout>
    )
  }
}

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