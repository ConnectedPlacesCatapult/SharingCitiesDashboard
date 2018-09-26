import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import Dashboard from './views/Dashboard';
import DataViewer from './views/DataViewer';
import Leaflet from './views/Leaflet';
/*import MapBox from './views/MapBox';*/

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <CssBaseline />
          <Route exact path="/" component={Dashboard} />
          <Route path="/dataviewer" component={DataViewer} />
          <Route path="/leaflet" component={Leaflet} />
          {/*<Route path="/mapbox" component={MapBox} />*/}
        </div>
      </Router>
    );
  }
}

export default App;
