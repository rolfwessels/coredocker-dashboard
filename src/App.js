// @flow strict

import React from 'react';
import './App.css';
import {
  LoginPage,
  DashboardPage,
  ProjectsPage,
  Error404
} from "./pages/";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "tabler-react/dist/Tabler.css";

type Props = {||};

class App extends React.Component<Props> {

  requireAuth(nextState: any, replace : any, next: any) {
    const authenticated = false;
    console.log('authenticated',authenticated);
    if (!authenticated) {
      replace({
        pathname: "/login",
        state: {nextPathname: nextState.location.pathname}
      });
    }
    next();
  }

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>

          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/" component={DashboardPage} onEnter={this.requireAuth} />
          <Route exact path="/projects" component={ProjectsPage} onEnter={this.requireAuth} />
          <Route component={Error404} />
        </Switch>
      </Router>
    );
  }
}

export default App;
