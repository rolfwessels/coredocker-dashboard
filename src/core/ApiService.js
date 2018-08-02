// @flow
import ApolloClient from "apollo-client";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import AppSettings from "./AppSettings";
import { loadToken } from "./AuthService";

class ErrorFetch extends Error {
  full : any;
}

export function jsonFetch(fetch: Promise<any>) : Promise<any> {
  return fetch
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return response.json().then(errorMessage => {
          let error = new ErrorFetch(errorMessage.error);
          error.full = errorMessage;
          console.error(`Error in fetch: ${response.status} ${errorMessage.error} ${errorMessage.error_description}`);
          throw (error);
        });
      }
    })
    .then(response => {
      return response.json();
    })
    .then(response => {
      return response;
    });
}

const httpLink = createHttpLink({
  uri: AppSettings.ApiEndPoint() + "/graphql",
});


const authLink = setContext((_, { headers }) => {
  let token = loadToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${String(token.access_token)}` : "",
    }
  }
});

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
}

const _graphql: ApolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});


class ApiService {

  graphql: ApolloClient;

  constructor() {
    this.graphql = _graphql;
  }

  query(query: any,variables: any) {
    return this.graphql.query({
      query : query,
      variables: variables
    })
  }

  mutate(mutation: any,variables: any) {

    return this.graphql.mutate({
      mutation : mutation,
      variables: variables
    })
  }

  cleanErrorMessage(error: any) {
    var err =  error.networkError.result.errors.map(x=>x.message);
    return err.find(d=>true);
  }


}

export default ApiService;
