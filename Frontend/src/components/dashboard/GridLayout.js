import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import RGL, { WidthProvider } from "react-grid-layout";
import { connect } from 'react-redux';
import { fetchLayout } from "./../../actions/layoutActions";
import { fetchWidgets } from './../../actions/widgetsActions';

import Widget from './Widget';

// ToDo :: overwrite some of the original base styles
import './../../../node_modules/react-grid-layout/css/styles.css';
import './../../../node_modules/react-resizable/css/styles.css';

const styles = theme => ({
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
    this.setState({ layout }, () => {
      //console.log(this.state.layout)
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.layout !== this.props.layout) {
      this.setState({ layout: this.props.layout })
    }
  }

  render() {
    const { classes } = this.props;
    const { layout } = this.state;

    const gridItems = layout.map((gridItem) => {
      let gridItemWidget = this.props.widgets.find((widget) => gridItem.i === widget.i);

      return (
        <div key={gridItem.i}>
          <Widget {...gridItemWidget} isStatic={gridItem.static || false} />
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

GridLayout = withStyles(styles)(GridLayout);
export default connect(mapStateToProps, mapDispatchToProps)(GridLayout);
