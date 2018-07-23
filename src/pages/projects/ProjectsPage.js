// @flow strict

import * as React from 'react';
import SiteWrapper from "../../components/SiteWrapper";
import {
  Page,
  Button,
  Text,
  Dimmer,
  Alert
} from "tabler-react";
import ProjectsList from './ProjectsList';
import gql from '../../../node_modules/graphql-tag';
import ApiService from '../../core/ApiService';

type Props = {||};

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

class ProjectsPage extends React.Component<Props> {
  apiService: ApiService


  constructor() {
    super();
    this.apiService = new ApiService();
    this.state = {
      projects: [],
      isLoading: true,
      error: '',
    };
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

  add(project) {
    document.location = `/project/add`;
  }

  update(project) {
    document.location = `/project/${project.id}`;
  }

  remove(project, callback) {
    this.apiService.mutate(DELETE_PROJECT, { projectId: project.id })
      .then(response => this.refreshData())
      .catch(response => this.setState({
        error: `Failed to remove project '${project.name}' from service.`
      }));
  }

  render() {
    var { projects } = this.state;
    return (
      <SiteWrapper>
        <Page.Content title={(<Text> Projects <Button onClick={() => this.add()} color="secondary" icon="plus" /> </Text>)}>
          {
            this.state.isLoading
              ? <Dimmer active loader></Dimmer>
              : <ProjectsList data={projects} update={(m, c) => this.update(m, c)} remove={(m, c) => this.remove(m, c)} />
          }
          {this.state.error && <Alert type="danger">{this.state.error}</Alert>}
        </Page.Content>


      </SiteWrapper>
    );
  }
}

export default ProjectsPage;
