// @flow

import * as React from "react";
import {
  Page,
  Grid,
  Dimmer,
  StampCard,
  Alert,
} from "tabler-react";
import gql from '../../../node_modules/graphql-tag';
import SiteWrapper from "../../components/SiteWrapper";
import ApiService from "../../core/ApiService";

type Props = {||};

type State = {
  isLoading: bool,
  error: string,
  projectsCount: number,
  usersCount: number,
};

const GET_COUNTS = gql`
  {
    projects { query { count } }
    users { query { count } }
  }
`;


class DashboardPage extends React.Component<Props, State> {
  apiService: ApiService
  state = {
    projectsCount: 0,
    usersCount: 0,
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
    this.apiService.query(GET_COUNTS)
      .then(response => this.setState({
        projectsCount: response.data.projects.query.count,
        usersCount: response.data.users.query.count,
        isLoading: false,
        error: ""
      }))
      .catch(response => this.setState({
        isLoading: false,
        error: "Failed to query date from server. Please try again later."
      }));
  }

  render() {
    return (
      <SiteWrapper>
        <Page.Content title="Dashboard">
          {
            this.state.isLoading
              ? <Dimmer active loader></Dimmer>
              : (
                <Grid.Row cards={true}>
                  <Grid.Col sm={6} lg={3}>
                    <StampCard color="blue" icon="server"
                      header={
                        <a href="/projects" >
                          {this.state.projectsCount} <small>Projects</small>
                        </a>
                      }
                    />
                  </Grid.Col>
                  <Grid.Col sm={6} lg={3}>
                    <StampCard color="green" icon="user"
                      header={
                        <a href="/users" >
                          {this.state.usersCount} <small>Users</small>
                        </a>
                      }
                    />
                  </Grid.Col>
                  {/* More */}
                </Grid.Row>
              )
          }
          {this.state.error && <Alert type="danger">{this.state.error}</Alert>}
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default DashboardPage;
