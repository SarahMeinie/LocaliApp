import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';

import { User } from 'src/services/user/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  account: { username: string, password: string } = {
    username: '',
    password: '',
  };

  backbuttontext: string;
  private loginErrorString: string;

  constructor(
    private router: Router,
    public user: User,
    private toastCtrl: ToastController,
    public translateService: TranslateService
    ) {
        this.translateService.get(['LOGIN_ERROR', 'CANCEL_BUTTON']).subscribe((values) => {
          this.loginErrorString = values['LOGIN_ERROR'];
          this.backbuttontext = values['CANCEL_BUTTON'];
        })
      }

  // Attempt to login in through our User service
  doLogin() {
    // TEMPORARY. Must take out when user auth is functional
    this.user.login(this.account).subscribe((resp) => {
      if (resp['response'] == 'Error') {
        this.presentToast();
      }
    }, (err) => {
      this.presentToast();
    });
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: this.loginErrorString,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }



  goToSignIn() {
    this.router.navigate(['/page-main']);
  }


  ngOnInit() {
  this.user.remember();
  }
}
