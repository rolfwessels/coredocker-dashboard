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
import ProjectsList from './ProjectsList';
import gql from '../../../node_modules/graphql-tag';
import ApiService from '../../core/ApiService';
import { Project } from './ProjectTypes';

type Props = {||};

type State = {
  projects: Project[],
  isLoading: bool,
  error: string,
};

const GET_PROJECTS = gql`
  {
    projects {
      all {
        id,
        name,
        updateDate
      }
    }
  }
`;

const DELETE_PROJECT = gql`mutation projectsDelete($projectId: String!) {
  projects {
    delete(id: $projectId)
  }
}`;

class ProjectsPage extends React.Component<Props, State> {
  apiService: ApiService
  state = {
    projects: [],
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
        projects: response.data.projects.all,
        isLoading: false
      }))
      .catch(response => this.setState({
        error: "Failed to read projects from service."
      }));
  }

  add() {
    window.location = '/project/add';
  }

  update(project: Project) {
    window.location = `/project/${project.id}`;
  }

  remove(project: Project, callback: any) {
    this.apiService.mutate(DELETE_PROJECT, { projectId: project.id })
      .then(response => {
        this.refreshData();
        callback();
      })
      .catch(response => this.setState({
        error: `Failed to remove project '${project.name}' from service.`
      }));
  }

  render() {
    var { projects } = this.state;
    return (
      <SiteWrapper>
        <Page.Content>
          <Header.H1>Projects<span style={{ 'margin-left': '15px' }}> <Button onClick={() => this.add()} color="secondary" icon="plus" /></span></Header.H1>
          {
            this.state.isLoading
              ? <Dimmer active loader></Dimmer>
              : <ProjectsList projects={projects} update={(m, c) => this.update(m)} remove={(m, c) => this.remove(m, c)} />
          }
          {this.state.error && <Alert type="danger">{this.state.error}</Alert>}
        </Page.Content>


      </SiteWrapper>
    );
  }
}

export default ProjectsPage;
