import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, BrowserRouter, IndexRoute } from 'react-router-dom';
import TestSocket from './components/TestingSocket';
import Multiplayer from './components/Multiplayer';
import { Game } from './components/Game';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.render((
   /* <Router history = {browserHistory}> */
   <Router basename={`${process.env.PUBLIC_URL}/`}>

      <Route exact path="/" component={Game} />
      {/* <IndexRoute component = {Game} /> */}
      <Route exact path="/testing" component={TestSocket} />
      <Route exact path="/multiplayer" component={Multiplayer} />
      {/* <Route path = "about" component = {About} />
       <Route path = "contact" component = {Contact} /> */}
      {/* </Route> */}
   </Router>), document.getElementById("root"));
