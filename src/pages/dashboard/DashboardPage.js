// @flow

import * as React from 'react';
import { Page, Grid, Dimmer, StampCard, Alert } from 'tabler-react';
import { Route } from 'react-router-dom';
import gql from '../../../node_modules/graphql-tag';
import { Observable } from 'apollo-link';
import SiteWrapper from '../../components/SiteWrapper';
import ApiService from '../../core/ApiService';
import AuthService from '../../core/AuthService';
import { Token } from '../../core/AuthService';

type Props = {||};

type State = {
  isLoading: boolean,
  error: string,
  projectsCount: number,
  usersCount: number
};

const GET_COUNTS_USER = `
    users { paged(includeCount:true) { count } }
`;

const GET_COUNTS_PROJECTS = `
    projects { paged(includeCount:true) { count } }
`;

const SUBSCRIPTION_CHANGES = gql`
  subscription {
    onDefaultEvent {
      event
      id
    }
  }
`;

class DashboardPage extends React.Component<Props, State> {
  apiService: ApiService;
  state = {
    projectsCount: 0,
    usersCount: 0,
    isLoading: true,
    error: ''
  };
  token: Token;
  subscription: Observable<any>;
  timeout: TimeoutID;

  constructor() {
    super();
    this.apiService = new ApiService();
    const authService = new AuthService();
    this.token = authService.currentToken();
  }

  componentDidMount() {
    this.refreshData();
    this.subscription = this.subscribeToDataChanges();
  }
  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  refreshData() {
    const GET_COUNTS = gql`
      {
        ${this.token.hasAccess('ReadProject') ? GET_COUNTS_PROJECTS : ''}
        ${this.token.hasAccess('ReadUsers') ? GET_COUNTS_USER : ''}
      }`;

    this.apiService
      .query(GET_COUNTS)
      .then(response =>
        this.setState({
          projectsCount: response.data.projects ? response.data.projects.paged.count : 0,
          usersCount: response.data.users ? response.data.users.paged.count : 0,
          isLoading: false,
          error: ''
        })
      )
      .catch(response =>
        this.setState({
          isLoading: false,
          error: 'Failed to query date from server. Please try again later.'
        })
      );
  }

  subscribeToDataChanges() {
    return this.apiService.subscribe(SUBSCRIPTION_CHANGES).subscribe(response => {
      if (response.errors) {
      } else {
        console.log(response.data);
        var { event } = response.data.onDefaultEvent;
        if (event.indexOf('Create') >= 0 || event.indexOf('Removed') >= 0) {
          if (this.timeout != null) clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.refreshData();
          }, 1000);
        }
      }
    });
  }

  render() {
    return (
      <SiteWrapper>
        <Route
          render={({ history }) => (
            <Page.Content title="Dashboard">
              {this.state.isLoading ? (
                <Dimmer active loader />
              ) : (
                <Grid.Row cards={true}>
                  {this.token.hasAccess('ReadProject') && (
                    <Grid.Col sm={6} lg={3}>
                      <StampCard
                        color="blue"
                        icon="server"
                        header={
                          <a
                            href="/projects"
                            onClick={e => {
                              e.preventDefault();
                              history.push(`/projects/`);
                            }}
                          >
                            {this.state.projectsCount} <small>Projects</small>
                          </a>
                        }
                      />
                    </Grid.Col>
                  )}
                  {this.token.hasAccess('ReadUsers') && (
                    <Grid.Col sm={6} lg={3}>
                      <StampCard
                        color="green"
                        icon="user"
                        header={
                          <a
                            href="/users"
                            onClick={e => {
                              e.preventDefault();
                              history.push(`/users/`);
                            }}
                          >
                            {this.state.usersCount} <small>Users</small>
                          </a>
                        }
                      />
                    </Grid.Col>
                  )}
                  {/* More */}
                </Grid.Row>
              )}
              {this.state.error && <Alert type="danger">{this.state.error}</Alert>}
            </Page.Content>
          )}
        />
      </SiteWrapper>
    );
  }
}

export default DashboardPage;
