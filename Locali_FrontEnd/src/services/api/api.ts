import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  url: string = 'https://www.locali.site/api';

  constructor(public http: HttpClient) {
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }
    return this.http.get(this.url + '/' + endpoint, reqOpts);

  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    console.log(this.url + '/' + endpoint, reqOpts);
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
  }

  async refreshToken() {
    //If sign up or register

    var promise =  new Promise ((resolve) => {
      let tokens = JSON.parse(localStorage.getItem('user_info'));
      let refresh = new Date(jwt_decode(tokens['refresh'])['exp'] * 1000);
      let access = new Date(jwt_decode(tokens['token'])['exp'] * 1000);
      var date = new Date();

      if (date < refresh && date > access) {
        let httpOptions = {
          headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        let new_token = this.http.post(this.url + '/' + 'account/token/refresh/', {"refresh" : tokens['refresh']}, httpOptions);
        new_token.subscribe((res) => {
          let obj = {
            id: tokens['id'],
            username: tokens['username'],
            refresh: res['refresh'],
            token: res['access']
          };
          localStorage.setItem('user_info', JSON.stringify(obj));
          resolve();
        });
      } else {
        resolve();
      }
    });

    return promise;
  }
}
