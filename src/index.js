import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, HashRouter, IndexRoute } from 'react-router-dom';
import TestSocket from './components/TestingSocket';
import Multiplayer1 from './components/Multiplayer';
import Multiplayer2 from './components/Multiplayer2';
import Multiplayer3 from './components/Multiplayer3';
import { Game } from './components/Game';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.render((
   /* <Router history = {browserHistory}> */
   <HashRouter basename='/'>

      <Route exact path='/' component={Game} />
      {/* <IndexRoute component = {Game} /> */}
      {/* <Route exact path='/testing' component={TestSocket} /> */}
      <Route exact path='/multiplayer/1' component={Multiplayer1} />
      <Route exact path='/multiplayer/2' component={Multiplayer2} />
      <Route exact path='/multiplayer/3' component={Multiplayer3} />
      {/* <Route path = "about" component = {About} />
       <Route path = "contact" component = {Contact} /> */}
      {/* </Route> */}
   </HashRouter>), document.getElementById("root"));
