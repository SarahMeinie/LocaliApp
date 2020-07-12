import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http'
import { User } from 'src/services/user/user';
import { HttpHeaders } from '@angular/common/http';
import { ApiDjangoService } from 'src/services/api/api-django.service';
import { Injectable } from '@angular/core';
import { Api } from 'src/services/api/api';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public avatar: string = "../../assets/avatar-icon.png";
  public editMode = false;
  userid = {
  user:""
  }
  user = {
  username: "",
  date_joined: "",
  email: "",
  first_name: "",
  last_name: "",
  image: "",
  }
  public postCount;
  public posts;
  public following;
  public followers;

  userDataToChange = {
    username: "",
    email: "",
    first_name: "",
    last_name: ""
  }

    constructor(
    private http: HttpClient,
    private router: Router,
    public translateService: TranslateService,
    public api: ApiDjangoService,
    public alertController: AlertController
    ){


    }

   onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.avatar = event.target.result as string;
      }
    }
  }

  async confirm(){
  await this.api.refreshToken();
  let user_info = JSON.parse(localStorage.getItem('user_info'));
  this.userid.user = user_info['id'];
  console.log("Data",this.userDataToChange);
  this.api.put('account/properties/update/', this.userDataToChange )
  .subscribe((response) => {
    console.log("PUT",response['results']);
  });
  }

  goHome() {
  this.router.navigate(['/page-main']);
  }

  profileMode() {
  this.editMode=!this.editMode;
  }

  updateUsername(event: any){
  this.user.username = event.target.value;
  this.userDataToChange.username = event.target.value;
  }
  updateFirstName(event: any){
  this.user.first_name = event.target.value;
  this.userDataToChange.first_name = event.target.value;
  }
  updateLastName(event: any){
  this.user.last_name = event.target.value;
  this.userDataToChange.last_name = event.target.value;
  }
  async presentAlert() {
   const alert = await this.alertController.create({
     cssClass: 'my-custom-class',
     header: 'Are You Sure ?',
     subHeader: 'Your account will be deleted.',
     buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          let user_info = JSON.parse(localStorage.getItem('user_info'));
          this.userid.user = user_info['id'];
          this.api.delete('account/'+this.userid.user+'/delete')
          .subscribe((response) => {
            console.log("DEL",response);
          });
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
   });


   await alert.present();
   }
  async ngOnInit() {
  await this.api.refreshToken();
   this.api.get('account/properties/')
   .subscribe((response) => {
     this.user.username = response['username'];
     this.userDataToChange.username = response['username'];
     this.user.date_joined = response['date_joined'];
     this.user.email = response['email'];
     this.userDataToChange.email = response['email'];
     this.user.first_name = response['first_name'];
     this.userDataToChange.first_name = response['first_name'];
     this.user.last_name = response['last_name'];
     this.userDataToChange.last_name = response['last_name'];
     this.user.image = response['image'];
   });
   let user_info = JSON.parse(localStorage.getItem('user_info'));
   this.userid.user = user_info['id'];
   console.log("FOLLOWERS", user_info );
   this.api.get('posts/user/'+ this.userid.user +'/')
   .subscribe((response) => {
     this.postCount = response['count'];
     this.posts = response['results'];
     console.log("POSTS",response);
   });


  }

}
