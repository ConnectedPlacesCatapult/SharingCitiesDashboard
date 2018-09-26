import React, { Component } from 'react';
import VegaLite from 'react-vega-lite';
import { withTheme } from '@material-ui/core/styles';

const spec = {
  "mark": "circle",
  "encoding": {
    "x": {
      "bin": {"maxbins": 10},
      "field": "IMDB_Rating",
      "type": "quantitative"
    },
    "y": {
      "bin": {"maxbins": 10},
      "field": "Rotten_Tomatoes_Rating",
      "type": "quantitative"
    },
    "size": {
      "aggregate": "count",
      "type": "quantitative"
    }
  }
};

const barData = {
  "values": []
};

class ScatterPlot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      spec: {}
    };
  }

  componentWillMount() {
    barData.values = this.props.data;

    this.setState({
      data: barData,
      spec: spec
    });
  }

  render() {
    return (
    <VegaLite spec={this.state.spec} data={this.state.data} />
    )
  }
}

export default withTheme()(ScatterPlot);