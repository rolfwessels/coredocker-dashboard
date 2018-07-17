// @flow strict

import AppSettings from './AppSettings';
import Oidc from 'oidc-client';
import ApiService from './ApiService';

export default class AuthService {
  url: string = "";
  urlToken: string = "";
  config: Any;
  token: Any = {};
  constructor() {
    this.url = new AppSettings().ApiEndPoint();
    this.urlToken = new AppSettings().ApiEndPoint()+"/connect/token";
    this.apiService = new ApiService();
    this.config = {
      authority: this.urlToken,
      client_id: "coredocker.api",
      client_secret: "super_secure_password",
      redirect_uri: "http://localhost:5003/callback.html",
      response_type: "id_token token",
      scope:"api",
      post_logout_redirect_uri : "/logout",
    };
    this.mgr = new Oidc.UserManager(this.config);
  }
  isLoggedIn() {
    console.log("token",this.token);
    return this.token.access_token;
  }

  serialize( obj ) {
    return Object.keys(obj).reduce(function(a,k){a.push(k+'='+encodeURIComponent(obj[k]));return a},[]).join('&')
  }

  login(email:string, password:string) {
     var data = {
      "client_id": this.config.client_id,
      "client_secret": this.config.client_secret,
      "username": email,
      "password": password,
      "grant_type": "password",
      "scope": "api",
     };
     return this.apiService.jsonFetch(fetch(this.urlToken, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers : {
          "Content-Type" : "application/x-www-form-urlencoded"
        },
        body: this.serialize(data),
    }))
    .then(token=>{
      this.token = token;
      this.isLoggedIn();
    })
  }
}


