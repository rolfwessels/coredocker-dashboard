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
        email,
        roles,
        updateDate
      }
    }
  }
`;

const INSERT_PROJECT = gql`mutation insertUser($userName: String!,$userEmail: String!,$userRoles: [String!]) {
  users {
    insert(
      user : {
          name:$userName,
          email:$userEmail,
          roles:$userRoles,
        })
    {
      id
    }
  }
}`;

const UPDATE_PROJECT = gql`mutation updateUser($id : String!, $userName: String!,$userEmail: String!,$userRoles: [String!]) {
  users {
    update(
      id:$id,
      user : {
        name:$userName,
        email:$userEmail,
        roles:$userRoles,
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
      userEmail : props.email,
      userRoles : props.roles,
    })
    .then(response => {
      result.setSubmitting( false);
      this.setState({error:""})
      this.props.history.goBack();
    }).catch((ex)=>{
      result.setSubmitting( false);
      const message = this.apiService.cleanErrorMessage(ex)
      console.error(ex);
      this.isAdd()
      ? this.setState({error:`Failed to add user: ${message}`})
      : this.setState({error:`Failed to update user. ${message}`})
    });
  }

  validate(values: UserCreateUpdate) {
    let errors = {};
    if (!values.name) {
      errors.name = "Name is required.";
    }
    if (!values.email) {
      errors.email = "Email is required.";
    }
    return errors;
  }

  updateCheckBoxes(update: any) {
    console.log('update',update);
  }


  render() {
    const roles = ["Admin","Guest"];
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
              setFieldValue,
            }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Input  name="name" value={values.name} onChange={handleChange} invalid={touched.name && errors.name} feedback={touched.name && errors.name } />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Input  name="email" value={values.email} onChange={handleChange} invalid={touched.email && errors.email} feedback={touched.email && errors.email } />
                  </Form.Group>

                  <Form.Group label="Roles">
                  { roles.map(ro => (
                    <Form.Checkbox
                      key={ro}
                      label={ro}
                      name="roles"
                      value={ro}
                      checked={values.roles !== undefined? values.roles.indexOf(ro) > -1 : false}
                      onChange={() => {
                        var valueRoles = values.roles||[];

                        if (valueRoles.includes(ro)) {
                          const nextValue = valueRoles.filter(
                            value => value !== ro
                          );
                          setFieldValue('roles',nextValue);
                        } else {
                          const nextValue = valueRoles.concat(ro);
                          setFieldValue('roles',nextValue);

                        }
                      }}
                    />
                  ))}

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
