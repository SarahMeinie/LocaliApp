import { Component, Input, OnInit } from '@angular/core';
import { ApiDjangoService } from 'src/services/api/api-django.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-post-template',
  templateUrl: './post-template.component.html',
  styleUrls: ['./post-template.component.scss'],
})
export class PostTemplateComponent implements OnInit{
  @Input() data: any;
  @Input() index: number;

  somethingWrongString: string;
  catColour: string[] = [];
  constructor(
    private api: ApiDjangoService,
    public translateService: TranslateService,
    private toastCtrl: ToastController,
  ) {
    this.translateService.get(['SOMETHING_WRONG']).subscribe((values) => {
      this.somethingWrongString = values['SOMETHING_WRONG'];
    })
  }

  async ngOnInit() { 
    await this.loadCategories();
  }

  async postLike() {
    await this.api.refreshToken();
    if (this.data['liked']) {
      this.data['liked'] = false;
      this.data['likes']--;
      this.api.delete('posts/likes/' + this.data['id'] + '/delete')
      .subscribe(() => {
      },
      (error) => {
        this.presentSomethingWrongToast();
      });
    } else {
      this.data['liked'] = true;
      this.data['likes']++;
      this.api.post('posts/likes/create/', {"post" : this.data['id']})
      .subscribe(() => {
      },
      (error) => {
        this.presentSomethingWrongToast();
      });
    }
  }

  async visitPost() {

  }

  async visitUser() {

  }

  async loadCategories() {
    await this.api.refreshToken();
    return new Promise((resolve) => {
      this.api.get('categories/')
      .subscribe((res:any) => {
        for (let i = 0; i < this.data['categories'].length; i++) {
          for (let j = 0; j < res.length; j++) {
            if (this.data['categories'][i] == res[j]['tag']) {
              this.catColour.push(res[j]['colour']);
            }
          }
        }
        resolve();
      }, (err) => {
        this.presentSomethingWrongToast();
        resolve();
      });
    });
  }

  async presentSomethingWrongToast() {
    const toast = await this.toastCtrl.create({
      message: this.somethingWrongString,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
