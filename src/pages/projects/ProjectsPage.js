// @flow

import * as React from 'react';
import SiteWrapper from '../../components/SiteWrapper';
import { Page, Button, Dimmer, Alert, Header } from 'tabler-react';
import ProjectsList from './ProjectsList';
import gql from '../../../node_modules/graphql-tag';
import ApiService from '../../core/ApiService';
import { Project } from './ProjectTypes';

type Props = {||};

type State = {
  projects: Project[],
  isLoading: boolean,
  error: string
};

const GET_PROJECTS = gql`
  {
    projects {
      list {
        id
        name
        updateDate
      }
    }
  }
`;

const DELETE_PROJECT = gql`
  mutation projectsDelete($projectId: String!) {
    projects {
      remove(id: $projectId) {
        id
      }
    }
  }
`;

const SUBSCRIPTION_PROJECT = gql`
  subscription {
    generalEvents {
      correlationId
      event
      id
    }
  }
`;

class ProjectsPage extends React.Component<Props, State> {
  apiService: ApiService;
  state = {
    projects: [],
    isLoading: true,
    isSilentLoading: false,
    error: ''
  };

  constructor() {
    super();
    this.apiService = new ApiService();
    this.subscription = this.subscribeToDataChanges();
  }
  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  componentDidMount() {
    this.refreshData();
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
      .query(GET_PROJECTS)
      .then(response =>
        this.setState({
          projects: response.data.projects.list,
          isLoading: false,
          isSilentLoading: false,
          error: ''
        })
      )
      .catch(response =>
        this.setState({
          isLoading: false,
          isSilentLoading: false,
          error: 'Failed to read projects from service.'
        })
      );
  }

  add() {
    window.location = '/project/add';
  }

  update(project: Project) {
    window.location = `/project/${project.id}`;
  }

  remove(project: Project, callback: any) {
    this.apiService
      .mutate(DELETE_PROJECT, { projectId: project.id })
      .then(response => {
        callback();
        this.removeIdFromList(project.id);
      })
      .catch(response =>
        this.setState({
          error: `Failed to remove project '${project.name}' from service.`
        })
      );
  }

  removeIdFromList(id) {
    var copy = [...this.state.projects];
    var index = copy.findIndex(project => project.id === id);
    if (index >= 0) {
      copy.splice(index, 1);
      this.setState({
        projects: copy
      });
    }
  }

  subscribeToDataChanges() {
    return this.apiService.subscribe(SUBSCRIPTION_PROJECT).subscribe(response => {
      if (response.errors) {
      } else {
        var { event, id } = response.data.generalEvents;
        if (event === 'ProjectCreated' || event === 'ProjectUpdated') {
          this.refreshData();
        } else if (event === 'ProjectRemoved') {
          this.removeIdFromList(id);
        }
      }
    });
  }

  render() {
    var { projects } = this.state;
    return (
      <SiteWrapper>
        <Page.Content>
          <Header.H1>
            Projects
            <span style={{ marginLeft: '15px' }}>
              {' '}
              <Button onClick={() => this.add()} color="secondary" icon="plus" />
            </span>
          </Header.H1>
          {this.state.isLoading ? (
            <Dimmer active loader />
          ) : (
            <ProjectsList projects={projects} update={(m, c) => this.update(m)} remove={(m, c) => this.remove(m, c)} />
          )}
          {this.state.error && <Alert type="danger">{this.state.error}</Alert>}
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default ProjectsPage;

/* scaffolding [
    {
      "FileName": "src\\App.js",
      "Indexline": "Route component",
      "InsertAbove": true,
      "InsertInline": false,
      "Lines": [
        "<Route path=\"/projects/\"  render={(routeProps) => ( this.isLoggedIn() ? (<ProjectsPage  {...routeProps}/>):(<Redirect to=\"/login\"/>) )}/>"
      ]
    },
    {
      "FileName": "src\\App.js",
      "Indexline": "ProjectsPage,",
      "InsertAbove": false,
      "InsertInline": false,
      "Lines": [
        "ProjectsPage,"
      ]
    },
    {
      "FileName": "pages\\index.js",
      "Indexline": "import ProjectsPage from",
      "InsertAbove": false,
      "InsertInline": false,
      "Lines": [
        "import ProjectsPage from \"./projects/ProjectsPage\";"
      ]
    },
    {
      "FileName": "pages\\index.js",
      "Indexline": "ProjectsPage,",
      "InsertAbove": false,
      "InsertInline": false,
      "Lines": [
        "ProjectsPage,"
      ]
    },
    {
      "FileName": "SiteWrapper.js",
      "Indexline": "{ value: \"Project\", to: \"/projects\" },",
      "InsertAbove": false,
      "InsertInline": false,
      "Lines": [
        "{ value: \"Project\", to: \"/projects\" },"
      ]
    },
    {
      "FileName": "DashboardPage.js",
      "Indexline": "projects { paged { count } }",
      "InsertAbove": false,
      "InsertInline": false,
      "Lines": [
        "projects { paged { count } }"
      ]
    },
    {
      "FileName": "DashboardPage.js",
      "Indexline": "projectsCount: number,",
      "InsertAbove": false,
      "InsertInline": false,
      "Lines": [
        "projectsCount: number,"
      ]
    },
    {
      "FileName": "DashboardPage.js",
      "Indexline": "projectsCount: 0,",
      "InsertAbove": false,
      "InsertInline": false,
      "Lines": [
        "projectsCount: 0,"
      ]
    },
    {
      "FileName": "DashboardPage.js",
      "Indexline": "projectsCount: response.data.projects.paged.count,",
      "InsertAbove": false,
      "InsertInline": false,
      "Lines": [
        "projectsCount: response.data.projects.paged.count,"
      ]
    },
    {
      "FileName": "DashboardPage.js",
      "Indexline": "{\/* More *\/}",
      "InsertAbove": true,
      "InsertInline": false,
      "Lines": [
        "<Grid.Col sm={6} lg={3}>",
        "  <StampCard color=\"blue\" icon=\"dollar-sign\"",
        "    header={",
        "      <a href=\"/projects\" >",
        "        {this.state.projectsCount} <small>Projects</small>",
        "      </a>",
        "    }",
        "  />",
        "</Grid.Col>",
      ]
    },
] scaffolding */
