import React, { Component } from 'react'
import {
  Page,
  Form,
  Button,
  Card,
  Dimmer,
  Alert,
} from "tabler-react";
import ApiService from '../../core/ApiService';
import SiteWrapper from "../../components/SiteWrapper";
import gql from '../../../node_modules/graphql-tag';
import { Formik } from "formik";

const INSERT_PROJECT = gql`mutation {
  projects {
    insert(project : {name : "casd"}) {
      id
    }
  }
}`;

const GET_PROJECT = gql`
  query getProject($id : String!){
    projects {
      byId(id:$id){
        id,
        name,
        updateDate
      }
    }
  }
`;

const UPDATE_PROJECT = gql`mutation updateProject($id : String!, $projectName: String) {
  projects {
    update(
      id:$id,
      project : {
          name:$projectName
        })
    {
      id
    }
  }
}`;

export default class ProjectUpdatePage extends Component {

  routeId: string;

  constructor() {
    super();
    this.apiService = new ApiService();
    this.state = {
      project: {},
      isLoading: true,
      error: '',
    };
  }

  componentDidMount() {
    this.routeId = this.props.match.params.id;
    this.loadData(this.routeId);
  }

  loadData(id) {
    this.apiService.query(GET_PROJECT, { id: id })
      .then(response => this.setState({
        project: response.data.projects.byId,
        isLoading: false
      }));
  }

  onCancel(props, result) {
    props.preventDefault();
    this.props.history.goBack();
  }

  onSave(props, result) {
    this.setState({error:""})
    this.apiService.mutate(UPDATE_PROJECT, {
      id: props.id ,
      projectName : props.name,
    })
    .then(response => {
      result.setSubmitting( false);
      this.props.history.goBack();
    }).catch((x,z)=>{
      result.setSubmitting( false);
      this.setState({error:"Failed to apply the update."})
    });
  }

  validate(values) {
    let errors = {};
    if (!values.name) {
      errors.name = "Name is required.";
    }
    return errors;
  }

  render() {
    const mainForm = (
      <Formik
            initialValues={this.state.project}
            validate={this.validate}
            onSubmit={(props, result) => this.onSave(props, result)}
            render={({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Input  name="name" value={values.name} onChange={handleChange} invalid={touched.name && errors.name} feedback={touched.name && errors.name } />
                    {/* invalid placeholder="Is Invalid" */}
                  </Form.Group>
                  <Form.Footer>
                    <Button.List>
                      <Button type="button" onClick={(e) => this.onCancel(e)} outline color="secondary" name="cancel"  >cancel</Button>
                      <Button type="submit" color="primary" name="save" disabled={isSubmitting}>Save</Button>
                    </Button.List>
                  </Form.Footer>
                </Form>
              )}
          />
    );
    return (
      <SiteWrapper>
        <Page.Content title="Project">
          <Card>
            <Card.Body>
              {this.state.isLoading?(<Dimmer active loader></Dimmer>): mainForm}
            </Card.Body>
            {this.state.error && (<Card.Alert color="danger" hasExtraSpace>
              <strong>Whoops!</strong> {this.state.error}
            </Card.Alert>)}
          </Card>
        </Page.Content>
      </SiteWrapper>
    )
  }
}
