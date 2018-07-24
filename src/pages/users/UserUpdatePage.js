// @flow

import React from 'react'
import {
  Page,
  Form,
  Button,
  Card,
  Dimmer,
} from "tabler-react";
import ApiService from '../../core/ApiService';
import SiteWrapper from "../../components/SiteWrapper";
import gql from '../../../node_modules/graphql-tag';
import { Formik } from "formik";
import { User, UserCreateUpdate } from './UserTypes';

const GET_PROJECT = gql`
  query getUser($id : String!){
    users {
      byId(id:$id){
        id,
        name,
        updateDate
      }
    }
  }
`;

const INSERT_PROJECT = gql`mutation insertUser($userName: String) {
  users {
    insert(
      user : {
          name:$userName
        })
    {
      id
    }
  }
}`;

const UPDATE_PROJECT = gql`mutation updateUser($id : String!, $userName: String) {
  users {
    update(
      id:$id,
      user : {
          name:$userName
        })
    {
      id
    }
  }
}`;


type Props = {
  history: any,
  match: any
};

type State = {
  user: User,
  isLoading: bool,
  error: string,
};

export default class UserUpdatePage extends React.Component<Props, State> {

  routeId: string;
  apiService: ApiService;
  state = {
    user: new User(),
    isLoading: false,
    error: '',
  };

  constructor() {
    super();
    this.apiService = new ApiService();
  }

  componentDidMount() {
    this.routeId = this.props.match.params.id;
    if (!this.isAdd())
      this.loadData(this.routeId);
  }

  isAdd() {
    return this.routeId === 'add';
  }

  loadData(id: string) {
    this.setState({isLoading:true});
    this.apiService.query(GET_PROJECT, { id: id })
      .then(response => this.setState({
        user: response.data.users.byId,
        error:   response.data.users.byId === null? `Failed could not load user with id '${id}'.` : '',
        isLoading: false,
      }))
      .catch(response => this.setState({
        isLoading: false,
        error: `Failed could not load user with id '${id}'.`
      }));;
  }

  onCancel(props: any, result: any) {
    props.preventDefault();
    this.props.history.goBack();
  }

  onSave(props: any, result: any) {

    this.setState({error:""})
    this.apiService.mutate( this.isAdd() ? INSERT_PROJECT : UPDATE_PROJECT, {
      id: props.id ,
      userName : props.name,
    })
    .then(response => {
      result.setSubmitting( false);
      this.setState({error:""})
      this.props.history.goBack();
    }).catch((x,z)=>{
      result.setSubmitting( false);
      this.setState({error:"Failed to apply the update."})
    });
  }

  validate(values: UserCreateUpdate) {
    let errors = {};
    if (!values.name) {
      errors.name = "Name is required.";
    }
    return errors;
  }

  render() {
    const mainForm = (
      <Formik
            initialValues={this.state.user}
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
                      <Button type="button" onClick={(e) => this.onCancel(e)} outline color="secondary">cancel</Button>
                      <Button type="submit" color="primary"  loading={isSubmitting} disabled={isSubmitting}>Save</Button>
                    </Button.List>
                  </Form.Footer>
                </Form>
              )}
          />
    );
    return (
      <SiteWrapper>
        <Page.Content title="User">
          <Card>
            <Card.Body>
              {this.state.isLoading?(<Dimmer active loader></Dimmer>): mainForm}
            </Card.Body>
            {this.state.error && (<Card.Alert color="danger"  >
              <strong>Whoops!</strong> {this.state.error}
            </Card.Alert>)}
          </Card>
        </Page.Content>
      </SiteWrapper>
    )
  }
}