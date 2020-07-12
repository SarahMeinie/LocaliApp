import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  public userName: string = null;
  public userDescription: string = null;
  constructor(public route: Router) {
  this.userName = "username";
  this.userDescription = "Nice butt";
  }

  confirm() {
  this.route.navigate(['/profile']);
  }
  ngOnInit() {
  }

}
