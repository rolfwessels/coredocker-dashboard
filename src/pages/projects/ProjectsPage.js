// @flow strict

import * as React from 'react';
import SiteWrapper from "../../components/SiteWrapper";
import {
  Page,

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
      isLoading: true
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
      }));
  }

  update(project) {
    document.location = `/project/${project.id}`;
  }

  remove(project, callback) {
    this.apiService.mutate(DELETE_PROJECT, { projectId: project.id })
      .then(response => this.refreshData());
  }

  render() {
    var { projects } = this.state;
    return (
      <SiteWrapper>
        <Page.Content title="Projects">

          <ProjectsList data={projects} update={(m, c) => this.update(m, c)} remove={(m, c) => this.remove(m, c)} />
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default ProjectsPage;
