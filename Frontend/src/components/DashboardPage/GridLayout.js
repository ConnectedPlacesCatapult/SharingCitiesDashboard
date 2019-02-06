import React from 'react';
import PropTypes from "prop-types";

import Widget from './Widget';

// material-ui
import { withStyles } from '@material-ui/core/styles';

// grid-layout
import RGL, { WidthProvider } from "react-grid-layout";
// ToDo :: overwrite some of the original base styles
import './../../../node_modules/react-grid-layout/css/styles.css';
import './../../../node_modules/react-resizable/css/styles.css';

// redux
import { connect } from 'react-redux';
import { fetchLayout, fetchWidgets } from "./../../actions/dashboardActions";

const styles = (theme) => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing.unit * 2,
  },
});

// ToDo :: check out WidthProvider
//const ReactGridLayout = WidthProvider(RGL);
const ReactGridLayout = RGL;

class GridLayout extends React.Component {
  constructor(props) {
    super(props);

    /*this.state = {
      layout: [],
    };*/

    //this.onLayoutChange = this.onLayoutChange.bind(this);

    this.props.fetchLayout();
    this.props.fetchWidgets();
  }

  componentWillMount() {

  }

  onLayoutChange(layout) {
    //this.setState({ layout });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    /*if (prevProps.layout !== this.props.dashboard.layout) {
      this.setState({ layout: this.props.dashboard.layout })
    }*/
  }

  render() {
    const { classes, dashboard } = this.props;
    //const { layout } = this.state;

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
};

const mapStateToProps = (state) => ({
  dashboard: state.dashboard,
});

const mapDispatchToProps = (dispatch) => ({
  fetchLayout: () => dispatch(fetchLayout()),
  fetchWidgets: () => dispatch(fetchWidgets()),
});

GridLayout = withStyles(styles)(GridLayout);
GridLayout = connect(mapStateToProps, mapDispatchToProps)(GridLayout);

export default GridLayout
