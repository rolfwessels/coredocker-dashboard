// @flow strict
import ApolloClient from "apollo-client";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import AppSettings from "./AppSettings";
import { loadToken } from "./AuthService";


export function jsonFetch(fetch) {
  return fetch
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return response.json().then(errorMessage => {
          let error = new Error(errorMessage.error);
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
  uri: new AppSettings().ApiEndPoint() + "/graphql",
});


const authLink = setContext((_, { headers }) => {
  let token = loadToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token.access_token}` : "",
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

const graphql: ApolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

class ApiService {

  graphql: ApolloClient;

  constructor() {
    this.graphql = graphql;
  }

  query(query) {
    return this.graphql.query({
      query : query
    })
  }

  mutate(mutation,variables) {

    return this.graphql.mutate({
      mutation : mutation,
      variables: variables
    })
  }


}

export default ApiService;
