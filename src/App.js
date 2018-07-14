import React, { Component } from 'react';
import logo from './logo.svg';
import MyCard from './components/mycard';
import './App.css';
import { 
  LoginPage,
  HomePage,
  Error404
} from "./pages/";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "tabler-react/dist/Tabler.css";

type Props = {||};

function App(props: Props): React.Node {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={LoginPage} />
        <Route component={Error404} />
      </Switch>
    </Router>
  );
}

export default App;
