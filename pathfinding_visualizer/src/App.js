import React from 'react';
import { BrowserRouter as Router , Route} from "react-router-dom";
import {Button , Jumbotron} from "react-bootstrap";
import Map from "./Map";
import Intro from "./Intro"
import Visualiser from "./Visualiser"
import Snippets from "./Snippets"
import "./leaflet/leaflet.css"

function App() {
  return (
    <Router>
      <div className="App">
        {/* Routing for the URL */}
        <Route exact path="/" render={props => (
          <React.Fragment>
            <Intro />
          </React.Fragment>
        )}>
        </Route>
        <Route path="/map" render={props => (
          <React.Fragment>
            <Map />
          </React.Fragment>
        )}>
        </Route>
        <Route path="/visualiser" render={props => (
          <React.Fragment>
            <Visualiser />
          </React.Fragment>
        )}>
        </Route> 
         <Route path="/snippets" render={props => (
          <React.Fragment>
            <Snippets />
          </React.Fragment>
        )}>
        </Route>
      </div>
    </Router>
  );
}

export default App;
