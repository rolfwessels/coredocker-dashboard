// @flow strict


import * as React from "react";
import { Formik } from "formik";
import AuthService from "../../core/AuthService";
import { LoginPage as TablerLoginPage } from "tabler-react";
import QueryString from "query-string";

type Props = {||};

class LoginPage extends React.Component<Props> {

  authService : AuthService
  constructor() {
    super();
    this.authService = new AuthService();
  }

  onLogin(values,{ setSubmitting, setErrors /* setValues and other goodies */ }  )
  {

    setSubmitting(true);
    this.authService.login(values.email,values.password).then((t) =>{
      console.log('login done');
      setSubmitting(false);
      document.location = "/";
    },(e)=>{
      console.error("error logging  in",e);
      setSubmitting(false);
      if (e.message=== "invalid_grant") {
        setErrors({password: "Invalid username or password." });
      }
      else
        setErrors({password: "Could not valid user. Please try again later." });

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
          email: "guest@guest.com",
          password: "guest!",
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
        onSubmit={(props,result) => this.onLogin(props,result) }
        render={({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <TablerLoginPage
            onSubmit={handleSubmit}
            onChange={handleChange}
            onBlur={handleBlur}
            values={values}
            errors={errors}
            touched={touched}
          />
        )}
      />
    );
  }
}

export default LoginPage;



