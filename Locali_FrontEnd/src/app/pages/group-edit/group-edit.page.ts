import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiDjangoService } from 'src/services/api/api-django.service';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.page.html',
  styleUrls: ['./group-edit.page.scss'],
})
export class GroupEditPage implements OnInit {
  groupId: number;
  groupName: string;

  couldNotSaveString: string;

  delete: boolean = false;
  leave: boolean = false;

  constructor(
    private api: ApiDjangoService,
    private router: Router,
    private toastCtrl: ToastController,
    private translateService: TranslateService,
  ) { 
    this.translateService.get(['COULD_NOT_SAVE']).subscribe((values) => {
      this.couldNotSaveString = values['COULD_NOT_SAVE'];
    })
  }

  ngOnInit() {
    this.groupId = this.router.getCurrentNavigation().extras.state.group;
    this.groupId = this.router.getCurrentNavigation().extras.state.group;
  }

  async submit() {
    this.api.post('grouping/posts/' + this.groupId + '/delete')
    .subscribe(() => {
      this.router.navigate(['/group'], { state: { group : this.groupId} });
    }, (err) => {
      this.presentToast();
      this.router.navigate(['/group'], { state: { group : this.groupId} });
    });
  }

  async deleteGroup() {
      
      /*this.api.delete('grouping/posts/' + this.groupId + '/delete')
      .subscribe(() => {
        this.router.navigate(['/page-main']);
      }, (err) => {
        this.presentToast();
        this.router.navigate(['/group'], { state: { group : this.groupId} });
      });*/
  }

  confirmDel() {
    setTimeout(() => {
      if (!this.delete) {
        this.delete = true;
        document.getElementById('butDelete').innerHTML = "Confirm";
      } else {
        this.api.delete('grouping/posts/' + this.groupId + '/delete')
        .subscribe(() => {
          this.router.navigate(['/page-main']);
        }, (err) => {
          this.presentToast();
          this.router.navigate(['/group'], { state: { group : this.groupId} });
        });
      }
    }, 500);
  }

  confirmLeave() {
    setTimeout(() => {
      if (!this.leave) {
        this.leave = true;
        document.getElementById('butLeave').innerHTML = "Confirm";
      } else {
        /*this.api.delete()
        .subscribe(() => {
          this.router.navigate(['/group'], { state: { group : this.groupId} });
        }, (err) => {
          this.presentToast();
          this.router.navigate(['/group'], { state: { group : this.groupId} });
        });*/
        this.router.navigate(['/group'], { state: { group : this.groupId} });
      }
    }, 500);
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: this.couldNotSaveString,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
