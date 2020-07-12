import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation';
import { MBService, Feature } from 'src/services/mapbox/mapbox.service';
import { ToastController } from '@ionic/angular';

import { ApiDjangoService } from 'src/services/api/api-django.service';

import { category } from 'src/models/category';
import { TranslateService } from '@ngx-translate/core';

const GROUPS = [
  { name: "Group Testing", id: 1 },
  { name: "Yeetus", id: 2 },
  { name: "The dark side of the moon", id: 3 },
]
class group {
  name: string;
  id: number
};

@Component({
  selector: 'modal-newpost',
  templateUrl: './modal-newpost.component.html',
  styleUrls: ['./modal-newpost.component.scss'],
})
export class ModalNewpostComponent implements OnInit {
  groupsChecked: boolean[] = [];
  groups: group[] = [];

  currentaddress: string = null;
  addresses: string[] = [];
  selectedAddress = null;

  shareButton: boolean = true;

  // spinner shows while address is loading
  showSpinner: boolean = true;

  allCategories: category[] = [];
  selectedCategories: category[] = [];
  categoriesIndex: number[] = [];

  objPost: ArrayBuffer;
  res: String[];

  newPost: { body: string, Latitude: number, Longitude: number, private: boolean, categories: String[] } = {
    body: null,
    Latitude: null,
    Longitude: null,
    private: false,
    categories: []
  };
  postId: number;

  private somethingWrongString: string;
  private categoryErrorString: string;

  constructor(
    private mapboxService: MBService,
    private modalController: ModalController,
    private toastCtrl: ToastController,
    private translateService: TranslateService,
    private api: ApiDjangoService
  ) {
    this.translateService.get(['SOMETHING_WRONG', 'NEW_POST_CATEGORY_ERROR']).subscribe((values) => {
      this.somethingWrongString = values['SOMETHING_WRONG'];
      this.categoryErrorString = values['NEW_POST_CATEGORY_ERROR'];
    })
  }

  async ngOnInit() {
    this.showSpinner = true;
    setTimeout(() => console.log('wait'), 5000); // debugging to see if spinner works
    this.findAddressFromCoords();
    await this.getCategories();
    this.initGroups();
  }

  async dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.currentaddress = null;
    await this.modalController.dismiss({
      'dismissed': true
    });
  }

  async sharePost() {
    //do something with api
    this.shareButton = false;

    if (this.selectedCategories.length < 2) {
      this.presentCategoryToast();
      this.shareButton = true;
      return;
    }

    this.newPost.private = !this.groupsChecked[0];

    this.selectedCategories.forEach(element => {
      this.newPost.categories.push(element['tag']);
    });

    const coo = await this.getCurrentPosition();
    this.newPost.Latitude = Math.round(coo.latitude * 1000000) / 1000000;
    this.newPost.Longitude = Math.round(coo.longitude * 1000000) / 1000000;

    await this.makeNewPost();

    for (let i = 1; i < this.groupsChecked.length; i++) {
      if (this.groupsChecked[i]) {
        this.api.post('grouping/posts/create', {
          post: this.postId,
          group: this.groups[i - 1]['id'],
          name: this.groups[i - 1]['name']
        })
        .subscribe((res) => {
          console.log("To group", res);
        }, (err) => {
          this.presentCategoryToast();
        });
      }
    }
    this.shareButton = true;

    this.dismissModal();
  }

  async makeNewPost() {
    await this.api.refreshToken();
    return new Promise((resolve) => {
      let obs = this.api.post('posts/create', this.newPost);
      obs.subscribe((response) => {
        this.postId = response['id'];
        resolve();
      }, (err) => {
        this.presentSomethingWrongToast();
        resolve();
      });
    });
  }

  getDate() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    return date;
  }

  getTime() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time;
  }

  getDateTime() {
    var date = this.getDate();
    var time = this.getTime();
    var dateTime = date + ' ' + time;
    return dateTime;
  }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();

    return coordinates.coords;
  }

  searchAddress(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapboxService
        .searchWord(searchTerm)
        .subscribe((features: Feature[]) => {
          this.addresses = features.map(feat => feat.place_name);
        });
    } else {
      this.addresses = [];
    }
  }

  selectAddress(address: string) {
    this.selectedAddress = address;
    this.addresses = [];
  }

  async findAddressFromCoords() {
    const coo = await this.getCurrentPosition();
    const searchTerm = coo.longitude.toString() + ',' + coo.latitude.toString();
    this.mapboxService
      .searchCoords(searchTerm)
      .subscribe((features: Feature[]) => {
        this.currentaddress = features[0].place_name;
      });
    this.showSpinner = false;
  }

  async getCategories() {
    await this.api.refreshToken();
    return new Promise((resolve) => {
      this.api.get('categories/')
      .subscribe((res:any) => {
        console.log(res);
        this.allCategories = <category[]> res;
        resolve();
      }, (err) => {
        console.log(err);
        this.presentSomethingWrongToast();
        resolve();
      });
    });
  }

  getCategoryColour(categoryName: string) {
    console.log(categoryName);
    var ret = this.allCategories.find(x => x.tag == categoryName).colour;
    //console.log(ret);
    return ret;
  }

  selectCategory(item: category) {
    this.selectedCategories.push(item);
    var index = this.allCategories.findIndex(x => x.tag == item.tag);
    this.categoriesIndex.push(index);
    this.allCategories.splice(index, 1);
  }

  deselectCategory(item: category) {

    var catIndex = this.selectedCategories.findIndex(x => x.tag == item.tag);
    var index = this.categoriesIndex[catIndex];
    this.allCategories.splice(index, 0, item);
    var index = this.selectedCategories.findIndex(x => x.tag == item.tag);
    this.selectedCategories.splice(index, 1);
    this.categoriesIndex.splice(catIndex, 1);
  }

  initGroups() {
    this.groupsChecked.push(true);
    for (let i = 0; i < GROUPS.length; i++) {
      this.groupsChecked.push(false);
    }
    this.api.get('grouping/1/user')
      .subscribe((res) => {
        res['results'].forEach(element => {
          let gr = new group();
          gr.name = element['name'];
          gr.id = element['id'];
          this.groups.push(gr);
        });
      });
  }

  async presentCategoryToast() {
    const toast = await this.toastCtrl.create({
      message: this.categoryErrorString,
      duration: 3000,
      position: 'top'
    });
    toast.present();
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
