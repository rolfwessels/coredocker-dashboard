// @flow

import * as React from 'react';
import SiteWrapper from '../../components/SiteWrapper';
import { Page, Button, Dimmer, Alert, Header } from 'tabler-react';
import UsersList from './UsersList';
import gql from '../../../node_modules/graphql-tag';
import ApiService from '../../core/ApiService';
import { User } from './UserTypes';
import { Observable } from 'apollo-link';

type Props = {
  history: any
};

type State = {
  users: User[],
  isLoading: boolean,
  isSilentLoading: boolean,
  error: string
};

const GET_USERS = gql`
  {
    users {
      list {
        id
        name
        email
        roles
        updateDate
      }
    }
  }
`;

const DELETE_USERS = gql`
  mutation usersDelete($userId: String!) {
    users {
      remove(id: $userId) {
        id
      }
    }
  }
`;

const SUBSCRIPTION_USERS = gql`
  subscription {
    generalEvents {
      correlationId
      event
      id
    }
  }
`;

class UsersPage extends React.Component<Props, State> {
  apiService: ApiService;
  state = {
    users: [],
    isLoading: true,
    isSilentLoading: false,
    error: ''
  };
  subscription: Observable<any>;
  timeout: TimeoutID;

  constructor() {
    super();
    this.apiService = new ApiService();
  }

  componentDidMount() {
    this.refreshData();
    this.subscription = this.subscribeToDataChanges();
  }
  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  refreshData() {
    if (this.state.isSilentLoading) {
      console.warn('Skip refresh user data because it is already loading.');
      return;
    }
    this.setState({
      isSilentLoading: true
    });

    this.apiService
      .query(GET_USERS)
      .then(response =>
        this.setState({
          users: response.data.users.list,
          isLoading: false,
          isSilentLoading: false,
          error: ''
        })
      )
      .catch(response =>
        this.setState({
          isLoading: false,
          isSilentLoading: false,
          error: 'Failed to read users from service.'
        })
      );
  }

  add() {
    this.props.history.push('/user/add');
  }

  update(user: User) {
    this.props.history.push(`/user/${user.id}`);
  }

  remove(user: User, callback: any) {
    this.apiService
      .mutate(DELETE_USERS, { userId: user.id })
      .then(response => {
        callback();
        this.removeIdFromList(user.id);
      })
      .catch(response =>
        this.setState({
          error: `Failed to remove user '${user.name}' from service.`
        })
      );
  }

  removeIdFromList(id: string) {
    var copy = [...this.state.users];
    var index = copy.findIndex(user => user.id === id);
    if (index >= 0) {
      copy.splice(index, 1);
      this.setState({
        users: copy
      });
    }
  }

  subscribeToDataChanges() {
    return this.apiService.subscribe(SUBSCRIPTION_USERS).subscribe(response => {
      if (response.errors) {
      } else {
        var { event, id } = response.data.generalEvents;
        if (event === 'UserCreated' || event === 'UserUpdated') {
          this.refreshData();
        } else if (event === 'UserRemoved') {
          this.removeIdFromList(id);
        } else {
          console.log('Ignore event:' + event);
        }
      }
    });
  }

  render() {
    var { users } = this.state;
    return (
      <SiteWrapper>
        <Page.Content>
          <Header.H1>
            Users
            <span style={{ marginLeft: '15px' }}>
              <Button onClick={() => this.add()} color="secondary" icon="plus" />
            </span>
          </Header.H1>
          {this.state.isLoading ? (
            <Dimmer active loader />
          ) : (
            <UsersList users={users} update={(m, c) => this.update(m)} remove={(m, c) => this.remove(m, c)} />
          )}
          {this.state.error && <Alert type="danger">{this.state.error}</Alert>}
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default UsersPage;
