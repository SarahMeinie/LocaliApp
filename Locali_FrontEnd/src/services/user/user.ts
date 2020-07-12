import{ Observable, of } from 'rxjs';
import { share } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { HttpHeaders } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;
  private httpOptions: any;

  constructor(public api: Api,
              public router: Router) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let seq = this.api.post('account/token/', accountInfo, this.httpOptions).pipe(share());

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'JWT ' + res['access']
        })
      };
      this.api.get('account/properties/', null, httpOptions)
      .subscribe((user) => {  
        let obj = {
          id: user['pk'],
          username: user['username'], 
          refresh: res['refresh'],
          token: res['access'] 
        }; 
        localStorage.setItem('user_info', JSON.stringify(obj));
        this.router.navigate(['page-main/tab-home'], { replaceUrl: true });
      });
      this._loggedIn(res); 
    });
    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('account/register/', accountInfo, this.httpOptions).pipe(share());

    return seq;
  }

  remember() {
    let jsn = localStorage.getItem('user_info');

    if (jsn) {
      let tokens = JSON.parse(jsn);
      let refresh = new Date(jwt_decode(tokens['refresh'])['exp'] * 1000);
      var date = new Date();
      if (date < refresh) {
        let new_token = this.api.post('account/token/refresh/', {"refresh" : tokens['refresh']}, this.httpOptions);
        new_token.subscribe((res) => {
          let obj = { 
            id: tokens['id'],
            username: tokens['username'], 
            refresh: res['refresh'],
            token: res['access'] 
          };
          localStorage.setItem('user_info', JSON.stringify(obj));
          this.router.navigate(['page-main/tab-home'], { replaceUrl: true });
        });
      }
    }
  }
  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
    localStorage.removeItem('user_info');
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }
}
