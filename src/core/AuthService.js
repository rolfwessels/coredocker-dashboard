// @flow

import AppSettings from './AppSettings';
import { jsonFetch } from './ApiService';
import ApiService from './ApiService';
import DeviceStorage from 'react-device-storage';
import gql from "graphql-tag";

export class Token {
  access_token: ?string;
  email: string;
  expires: Date;
  id: string;
  name: string;
  roles: string[];
  activities: string[];

  isValid() {
    const expDate = new Date(this.expires)
    let loggedIn = this.access_token ? expDate > new Date() : false
    return loggedIn;
  }
  hasAccess(activity: string) {
    const isAllowed = this.activities.some(x => x === activity);
    return isAllowed;
  }
};

export const loadToken = () : Token => {
  return Object.assign(new Token(), storage.read('authServiceToken')) || new Token();
}

const storage = new DeviceStorage({
  cookieFallback: true,
  cookie: {
    secure: true
  }
}).localStorage();

const GET_USER_ME =gql`
{
  users {
    me {
      name,email,roles,id,activities
    }
  }
}`;


export default class AuthService {
  url: string = "";
  urlToken: string = "";
  config: any;
  token: Token = new Token();
  storage : DeviceStorage;
  apiService : ApiService;
  constructor() {

    this.url = AppSettings.ApiEndPoint();
    this.urlToken = AppSettings.ApiEndPoint() + "/connect/token";
    this.storage = storage;
    this.apiService = new ApiService();
    this.token = loadToken();

    this.config = {
      authority: this.urlToken,
      client_id: "coredocker.api",
      client_secret: "super_secure_password",
      redirect_uri: "http://localhost:5003/callback.html",
      response_type: "id_token token",
      scope: "api",
      post_logout_redirect_uri: "/logout",
    };
  }

  isLoggedIn() {
    return this.token.isValid();
  }

  currentToken(): Token {
    return this.token;
  }

  serialize(obj: any) {
    return Object.keys(obj).reduce(function (a, k) { a.push(k + '=' + encodeURIComponent(obj[k])); return a }, []).join('&')
  }

  login(email: string, password: string) {
    var data = {
      "client_id": this.config.client_id,
      "client_secret": this.config.client_secret,
      "username": email,
      "password": password,
      "grant_type": "password",
      "scope": "api",
    };


    return jsonFetch(fetch(this.urlToken, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: this.serialize(data),
    }))
      .then(tokenResponse => {

        const token = new Token()
        token.access_token = tokenResponse.access_token;
        token.expires = new Date(new Date().getTime() + (tokenResponse.expires_in * 1000));
        this.storeToken(token);
        return this.apiService.query(GET_USER_ME).then(result => {
          const me = result.data.users.me;
          token.name = me.name;
          token.email = me.email;
          token.roles = me.roles;
          token.activities = me.activities;
          token.id = me.id;
          this.storeToken(token);
        })
      })
  }

  logout() {
    console.log("logging out");
    const token = new Token()
    token.access_token = null;
    token.expires = new Date();
    token.name = '';
    token.email = '';
    token.roles = [];
    token.activities = [];
    token.id = '';
    this.storeToken(token)
  }

  storeToken(token: any) {
    this.token = Object.assign(this.token,token);
    this.storage.save('authServiceToken', this.token);
  }

}


