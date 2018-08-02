// @flow

import React from 'react';
import './App.css';
import {
  LoginPage,
  DashboardPage,
  ProjectsPage,
  UsersPage,
  ProjectUpdatePage,
  UserUpdatePage,
  Error404,
  RegisterPage,
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
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/"  render={(routeProps) => ( this.isLoggedIn() ? (<DashboardPage   {...routeProps} />):(<Redirect to="/login"/>) )} />
          <Route path="/projects/"  render={(routeProps) => ( this.isLoggedIn() ? (<ProjectsPage  {...routeProps}/>):(<Redirect to="/login"/>) )}/>
          <Route path="/project/:id"  render={(routeProps) => ( this.isLoggedIn() ? (<ProjectUpdatePage  {...routeProps}/>):(<Redirect to="/login"/>) )}/>

          <Route path="/users/"  render={(routeProps) => ( this.isLoggedIn() ? (<UsersPage  {...routeProps}/>):(<Redirect to="/login"/>) )}/>
          <Route path="/user/:id"  render={(routeProps) => ( this.isLoggedIn() ? (<UserUpdatePage  {...routeProps}/>):(<Redirect to="/login"/>) )}/>
          <Route component={Error404} />
        </Switch>
      </Router>
    );
  }
}

export default App;
