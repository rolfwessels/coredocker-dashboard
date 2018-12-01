// @flow
import { Route } from 'react-router-dom';
import * as React from 'react';
import { Formik } from 'formik';
import AuthService from '../../core/AuthService';
import { FormCard, FormTextInput, StandaloneFormPage, Text } from 'tabler-react';
import QueryString from 'query-string';
import gql from '../../../node_modules/graphql-tag';
import ApiService from '../../core/ApiService';

type Props = {
  location: Location
};

type RegisterData = {
  name: string,
  email: string,
  password: string
};

const REGISTER_USER = gql`
  mutation registerUser($userName: String!, $userEmail: String!, $userPassword: String!) {
    users {
      register(user: { name: $userName, email: $userEmail, password: $userPassword }) {
        id
      }
    }
  }
`;

class RegisterPage extends React.Component<Props> {
  authService: AuthService;
  apiService: ApiService;

  constructor() {
    super();
    this.authService = new AuthService();
    this.apiService = new ApiService();
  }

  onRegister(values: RegisterData, { setSubmitting, setErrors }: any) {
    setSubmitting(true);
    this.apiService
      .mutate(REGISTER_USER, {
        userName: values.name,
        userEmail: values.email,
        userPassword: values.password
      })
      .then(
        t => {
          console.log('Register done');
          setSubmitting(false);
          this.authService.login(values.email, values.password).then(
            t => {
              console.log('login done');
              this.props.history.push('/');
            },
            e => {
              this.props.history.push('/');
            }
          );
        },
        e => {
          console.error('error logging  in', e);
          setSubmitting(false);
          if (e.message === 'invalid_grant') {
            setErrors({ password: 'Invalid username or password.' });
          } else setErrors({ password: 'Could not valid user. Please try again later.' });
        }
      );
  }

  componentDidMount() {
    var isLogoutRequested = QueryString.parse(this.props.location.search).logout || false;
    if (isLogoutRequested) this.authService.logout();
  }

  render() {
    return (
      <Formik
        initialValues={{}}
        validate={values => {
          // same as above, but feel free to move this into a class method now.
          let errors = {};
          if (!values.password) {
            errors.password = 'Required';
          }
          if (!values.name) {
            errors.name = 'Required';
          }
          if (!values.email) {
            errors.email = 'Required';
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
          }
          return errors;
        }}
        onSubmit={(props, result) => this.onRegister(props, result)}
        render={({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <div>
            <StandaloneFormPage>
              <FormCard buttonText="Create Account" title="Create New Account" onSubmit={handleSubmit}>
                <FormTextInput
                  name="name"
                  label="Name"
                  placeholder="John Doe"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values && values.name}
                  error={errors && errors.name}
                />
                <FormTextInput
                  name="email"
                  label="Email"
                  placeholder="name@domain.com"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values && values.email}
                  error={errors && errors.email}
                />
                <FormTextInput
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="********"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values && values.password}
                  error={errors && errors.password}
                />
              </FormCard>
            </StandaloneFormPage>
            <Route
              render={({ history }) => (
                <div style={{ display: 'block', textAlign: 'center' }}>
                  <Text.Small muted>
                    Already have account?{' '}
                    <a
                      href="/login"
                      onClick={e => {
                        e.preventDefault();
                        history.push(`/login/`);
                      }}
                    >
                      Sign in
                    </a>
                  </Text.Small>
                </div>
              )}
            />
          </div>
        )}
      />
    );
  }
}

export default RegisterPage;
