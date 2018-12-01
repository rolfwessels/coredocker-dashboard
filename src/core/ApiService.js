// @flow
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import AppSettings from './AppSettings';
import { loadToken } from './AuthService';
import { split, Observable } from 'apollo-link';
import { getMainDefinition } from '../../node_modules/apollo-utilities';
import { WebSocketLink } from 'apollo-link-ws';

class ErrorFetch extends Error {
  full: any;
}

export function jsonFetch(fetch: Promise<any>): Promise<any> {
  return fetch
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return response.json().then(errorMessage => {
          let error = new ErrorFetch(errorMessage.error);
          error.full = errorMessage;
          console.error(`Error in fetch: ${response.status} ${errorMessage.error} ${errorMessage.error_description}`);
          throw error;
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
  uri: AppSettings.ApiEndPoint() + '/graphql'
});

const authLink = setContext((_, { headers }) => {
  let token = loadToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${String(token.access_token)}` : ''
    }
  };
});

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  }
};
const wsLink = () => {
  return new WebSocketLink({
    uri:
      AppSettings.ApiEndPoint()
        .replace('https://', 'wss://')
        .replace('http://', 'ws://') + '/graphql',
    options: {
      reconnect: true,
      connectionParams: {
        authToken: 'loadToken().access_token'
      }
    }
  });
};

const buildLink = () => {
  if (AppSettings.ApiEndPoint().indexOf('https') === 0) {
    console.log('Connect https only.');
    return authLink.concat(httpLink);
  }
  console.log('Connect to graphql subscriptions.');
  return split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);

      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink(),
    authLink.concat(httpLink)
  );
};

const _graphql: ApolloClient = new ApolloClient({
  link: buildLink(),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions
});

class ApiService {
  graphql: ApolloClient;

  constructor() {
    this.graphql = _graphql;
  }

  query(query: any, variables: any) {
    return this.graphql.query({
      query: query,
      variables: variables
    });
  }

  mutate(mutation: any, variables: any) {
    return this.graphql.mutate({
      mutation: mutation,
      variables: variables
    });
  }

  subscribe(subscribe: any, variables: any): Observable<any> {
    return this.graphql.subscribe({
      query: subscribe,
      variables: variables
    });
  }

  cleanErrorMessage(error: any) {
    var err = error.networkError.result.errors.map(x => x.message);
    return err.find(d => true);
  }
}

export default ApiService;
