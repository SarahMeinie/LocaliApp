import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { HttpHeaders } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ApiDjangoService {

  private httpOptions: any;

  constructor(
    private http: HttpClient,
    private api: Api
    ){}

  get(endpoint: string, params?: any) {
    let user_info = JSON.parse(localStorage.getItem('user_info'));

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + user_info['token']
      })
    };

    return this.api.get(endpoint, params, httpOptions);
  }

  post(endpoint: string, params?: any) {
    let user_info = JSON.parse(localStorage.getItem('user_info'));

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + user_info['token']
      })
    };

    return this.api.post(endpoint, params, httpOptions);
  }

  put(endpoint: string, params?: any) {
    let user_info = JSON.parse(localStorage.getItem('user_info'));

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + user_info['token']
      })
    };

    return this.api.put(endpoint, params, httpOptions);
  }

  delete(endpoint: string) {
    let user_info = JSON.parse(localStorage.getItem('user_info'));

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + user_info['token']
      })
    };

    return this.api.delete(endpoint, httpOptions);
  }

  patch(endpoint: string, params?: any) {
    let user_info = JSON.parse(localStorage.getItem('user_info'));

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + user_info['token']
      })
    };

    return this.api.patch(endpoint, params, httpOptions);
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
        let new_token = this.api.post('account/token/refresh/', {"refresh" : tokens['refresh']}, httpOptions);
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
