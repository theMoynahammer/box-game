import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, BrowserRouter, IndexRoute } from 'react-router-dom';
import {TestingSocket} from './components/TestingSocket';
import { Game } from './components/Game';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.render((
/* <Router history = {browserHistory}> */
    <Router>

    <Route exact path = "/" component = {Game}/>
       {/* <IndexRoute component = {Game} /> */}
       <Route exact path="/testing" component={TestingSocket} />
       {/* <Route path = "about" component = {About} />
       <Route path = "contact" component = {Contact} /> */}
    {/* </Route> */}
 </Router>), document.getElementById("root"));
