// @flow strict

import React from 'react';
import './App.css';
import {
  LoginPage,
  DashboardPage,
  ProjectsPage,
  Error404
} from "./pages/";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import AuthService from "./core/AuthService"
import "tabler-react/dist/Tabler.css";

type Props = {||};

class App extends React.Component<Props> {
  _authService : AuthService  = new AuthService()

  isLoggedIn()
  {
    return this._authService.isLoggedIn();
  }

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>

          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/"  render={() => ( this.isLoggedIn() ? (<DashboardPage />):(<Redirect to="/login"/>) )} />
          <Route exact path="/projects"  render={() => ( this.isLoggedIn() ? (<ProjectsPage />):(<Redirect to="/login"/>) )}/>
          <Route component={Error404} />
        </Switch>
      </Router>
    );
  }
}

export default App;
