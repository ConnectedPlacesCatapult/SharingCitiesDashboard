import React from 'react';
import PropTypes from "prop-types";
import RGL, { WidthProvider } from "react-grid-layout";
import { connect } from 'react-redux';
import { fetchLayout } from "./../../actions/layoutActions";
import { fetchWidgets } from './../../actions/widgetsActions';

import Widget from './Widget';

// ToDo :: overwrite some of the original base styles
import './../../../node_modules/react-grid-layout/css/styles.css';
import './../../../node_modules/react-resizable/css/styles.css';


// ToDo :: check out WidthProvider
//const ReactGridLayout = WidthProvider(RGL);
const ReactGridLayout = RGL;

class GridLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: [],
    };

    this.onLayoutChange = this.onLayoutChange.bind(this);
  }

  componentWillMount() {
    this.props.fetchLayout();
    this.props.fetchWidgets();
  }

  onLayoutChange(layout) {
    this.setState({ layout });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.layout !== this.props.layout) {
      this.setState({ layout: this.props.layout })
    }
  }

  render() {
    const { layout } = this.state;

    const gridItems = layout.map((gridItem) => {
      let gridItemWidget = this.props.widgets.filter((widget) => gridItem.i === widget.i)[0];

      return (
        <div key={gridItem.i}>
          <Widget {...gridItemWidget} />
        </div>
      )
    });

    return (
      <ReactGridLayout
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        onLayoutChange={this.onLayoutChange}
      >
        {gridItems}
      </ReactGridLayout>
    )
  }
}

GridLayout.propTypes = {
  layout: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  return {
    layout: state.layout.layout,
    widgets: state.widgets.widgets,
  }
};

const mapDispatchToProps = {
  fetchLayout,
  fetchWidgets,
};


export default connect(mapStateToProps, mapDispatchToProps)(GridLayout);
