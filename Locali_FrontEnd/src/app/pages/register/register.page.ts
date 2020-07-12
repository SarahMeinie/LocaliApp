import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';

import { User } from 'src/services/user/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  account: { username: string,  email: string, password: string , password2: string} = {
    username: '',
    email: '',
    password: '',
    password2: '',
  };

  backbuttontext: string;
  private signupErrorString: string;

  constructor(
    private router:Router,
    public user: User,
    private toastCtrl: ToastController,
    public translateService: TranslateService
    ) {
      this.translateService.get(['SIGNUP_ERROR', 'CANCEL_BUTTON']).subscribe((values) => {
        this.signupErrorString = values['SIGNUP_ERROR'];
        this.backbuttontext = values['CANCEL_BUTTON'];
      })
     }

     doSignup() {
      // Attempt to login in through our User service
      this.account.password2 = this.account.password;
      this.user.signup(this.account).subscribe((resp) => {
        if (resp['response'] == 'Error') {
          //Error message
          this.presentToast(resp['error_message']);
        } else {
          this.presentWelcomeToast();
        }
      }, (err) => {
        // Unable to sign up
        this.presentToast(err);
      });

     }


  async presentToast(err: string) {
    const toast = await this.toastCtrl.create({
      message: err,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  async presentWelcomeToast() {
    const toast = await this.toastCtrl.create({
      message: "Please verify your email via the provided email address. Once verified, you may log in!",
      duration: 6000,
      position: 'top'
    });
    toast.present();
  }

  goTo(){
  this.router.navigate(['login']);
  }

  ngOnInit() {
  }

}
