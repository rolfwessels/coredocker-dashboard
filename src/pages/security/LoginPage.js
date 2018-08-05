// @flow


import * as React from "react";
import { Formik } from "formik";
import AuthService from "../../core/AuthService";
import { LoginPage as TablerLoginPage } from "tabler-react";
import { Text } from "tabler-react";
import QueryString from "query-string";
import DeviceStorage from 'react-device-storage';

type Props = {
  location: Location
};

type LoginData = {
  email: string,
  password: string,
};

const storage = new DeviceStorage({
  cookieFallback: true,
  cookie: {
    secure: true
  }
}).localStorage();

class LoginPage extends React.Component<Props> {

  authService: AuthService
  constructor() {
    super();
    this.authService = new AuthService();
  }

  onLogin(values: LoginData, { setSubmitting, setErrors }: any) {

    setSubmitting(true);
    this.authService.login(values.email, values.password).then((t) => {
      console.log('login done');
      setSubmitting(false);
      storage.save('lastLoginEmail',values.email);
      window.location = '/';
    }, (e) => {
      console.error("error logging  in", e);
      setSubmitting(false);
      if (e.message === "invalid_grant") {
        setErrors({ password: "Invalid username or password." });
      }
      else
        setErrors({ password: "Could not valid user. Please try again later." });

    })
  }

  componentDidMount() {
    var isLogoutRequested = QueryString.parse(this.props.location.search).logout || false;
    if (isLogoutRequested)
      this.authService.logout()
  }

  render() {
    return (
      <Formik
        initialValues={{
          email: storage.read('lastLoginEmail'),
          password: "",
        }}
        validate={values => {
          // same as above, but feel free to move this into a class method now.
          let errors = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          return errors;
        }}
        onSubmit={(props, result) => this.onLogin(props, result)}
        render={({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
            <div>
              <TablerLoginPage
                onSubmit={handleSubmit}
                onChange={handleChange}
                onBlur={handleBlur}
                values={values}
                errors={errors}
                touched={touched}
              />
              <div style={{display:"block", textAlign:"center"}}>
                <Text.Small muted>
                  Don't have account yet? <a href="/register">Sign up</a>
                </Text.Small>
              </div>
            </div>
          )}
      />
    );
  }
}

export default LoginPage;



