import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import Widget from './Widget';

import './Grid.css';

class Grid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layoutData: props.layoutData,
      widgets: []
    };
  }

  handleLayoutChange = (layout) => {
    this.setState({ layout: layout });
  };

  componentWillMount() {
    let widgets = [];

    this.state.layoutData.forEach((row, i) => {
      widgets[i] = {
        i: i,
        component: row.component,
        name: row.name,
        grid: row.grid,
        options: row.options || {},
        data: row.data || {}
      };
    });

    this.setState({ widgets: widgets });
  }

  handleDeleteWidget = key => {
    this.setState({ widgets: this.state.widgets.filter((widget) => {
      return widget.i !== key;
    })});
  };

  render() {
    const widgets = this.state.widgets.map((widget, i) => {
      return <Widget key={i} data-grid={widget.grid} {...widget} onDelete={key => this.handleDeleteWidget(key)} />
    });

    return (
      <GridLayout
        className="grid layout"
        cols={12}
        rowHeight={100}
        width={1200}
        containerPadding={[0, 0]}
        onLayoutChange={layout => this.handleLayoutChange(layout)}
      >
        {widgets}
      </GridLayout>
    )
  }
}

export default Grid;