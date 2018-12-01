// @flow

import * as React from 'react';
import SiteWrapper from "../../components/SiteWrapper";
import {
  Page,
  Button,
  Dimmer,
  Alert,
  Header,
} from "tabler-react";
import UsersList from './UsersList';
import gql from '../../../node_modules/graphql-tag';
import ApiService from '../../core/ApiService';
import { User } from './UserTypes';

type Props = {||};

type State = {
  users: User[],
  isLoading: bool,
  error: string,
};

const GET_PROJECTS = gql`
  {
    users {
      list {
        id,
        name,
        email,
        roles,
        updateDate
      }
    }
  }
`;

const DELETE_PROJECT = gql`mutation usersDelete($userId: String!) {
  users {
    delete(id: $userId)
  }
}`;

class UsersPage extends React.Component<Props, State> {
  apiService: ApiService
  state = {
    users: [],
    isLoading: true,
    error: '',
  };

  constructor() {
    super();
    this.apiService = new ApiService();
  }

  componentDidMount() {
    this.refreshData();
  }

  refreshData() {
    this.apiService.query(GET_PROJECTS)
      .then(response => this.setState({
        users: response.data.users.list,
        isLoading: false,
        error: ""
      }))
      .catch(response => this.setState({
        isLoading: false,
        error: "Failed to read users from service."
      }));
  }

  add() {
    window.location = '/user/add';
  }

  update(user: User) {
    window.location = `/user/${user.id}`;
  }

  remove(user: User, callback: any) {
    this.apiService.mutate(DELETE_PROJECT, { userId: user.id })
      .then(response => {
        this.refreshData();
        callback();
      })
      .catch(response => this.setState({
        error: `Failed to remove user '${user.name}' from service.`
      }));
  }

  render() {
    var { users } = this.state;
    return (
      <SiteWrapper>
        <Page.Content>
          <Header.H1>Users<span style={{ 'marginLeft': '15px' }}> <Button onClick={() => this.add()} color="secondary" icon="plus" /></span></Header.H1>
          {
            this.state.isLoading
              ? <Dimmer active loader></Dimmer>
              : <UsersList users={users} update={(m, c) => this.update(m)} remove={(m, c) => this.remove(m, c)} />
          }
          {this.state.error && <Alert type="danger">{this.state.error}</Alert>}
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default UsersPage;
