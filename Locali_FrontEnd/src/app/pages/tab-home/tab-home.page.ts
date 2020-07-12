import { Component, ViewChild, OnInit, ComponentFactoryResolver, ViewContainerRef, AfterViewInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastController, NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation';
import { MBService, Feature } from 'src/services/mapbox/mapbox.service';
import { MBComponent } from 'src/models/map-box/map-box.component';
import { PopoverFilterComponent } from 'src/app/components/popover-filter/popover-filter.component';
import { ModalFilterComponent } from 'src/app/components/modal-filter/modal-filter.component'
import { ApiDjangoService } from 'src/services/api/api-django.service';
import { post } from 'src/models/posts';
import { PostTemplateComponent } from 'src/app/components/post-template/post-template.component';

export class postData {
  username: string;
  userId: string;
  avatar: string;
  id: number;
  date: Date;
  body: string;
  likes: number;
  comments: number;
  liked: boolean;
  address: string;
  categories: string[];
}

class group{ 
  name: string;
  id: number 
};

@Component({
  selector: 'app-tab-home',
  templateUrl: 'tab-home.page.html',
  styleUrls: ['tab-home.page.scss']
})
export class TabHomePage implements OnInit, AfterViewInit {

@ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
@ViewChild(MBComponent) mapboxComponent: MBComponent;
@ViewChild('postContainer', { read: ViewContainerRef }) entry:ViewContainerRef;

    activePath = '';
    group: number = 4;
    hide: boolean = true;

    // menu language settings
    searchMenuTitle: string;
    groupsMenuTitle: string;
    somethingWrongString: string;

    view: string; //home tab: Map or List
    altview: string;
    search: string; //search menu: segment - user or group


    currentPopover: any = null;
    
    currentUser: string[] = [];
    allPostData: postData[] = [];

    componentPosts: any[] = [];

    groups: group[] = [];
    posts: post[];
    offset: number = 0;
    page: number = 1;
    postCount: number = 0;

    groupsLoaded: boolean = false;
    dataLoaded: boolean;
    postLoaded: boolean[]  = [];
    postLiked: boolean[] = [];

    addresses: string[] = [];
    selectedAddress = null;

    constructor(
      private router: Router,
      private menu: MenuController,
      private modalController: ModalController,
      public popoverController: PopoverController,
      private mapboxService: MBService,
      public translateService: TranslateService,
      private toastCtrl: ToastController,
      public api: ApiDjangoService,
      private resolver: ComponentFactoryResolver,
      public navCtrl: NavController
    )
    {
      this.router.events.subscribe((event: RouterEvent) => {
        this.activePath = event.url
      })
      this.translateService.get(['SOMETHING_WRONG']).subscribe((values) => {
        this.somethingWrongString = values['SOMETHING_WRONG'];
      })

      //this.translateService.get(['TAB1_TITLE', 'TAB2_TITLE', 'TAB3_TITLE']).subscribe(values => {
      //  this.searchMenuTitle = values['TAB1_TITLE'];
      //  this.groupsMenuTitle = values['TAB2_TITLE'];
      //});
    }

    ngOnInit() {
      this.view = 'List';
      this.altview = 'Map';
      this.search = 'users-segment';
      //this.mapboxComponent.buildMap();
      this.initListView();
      let tokens = JSON.parse(localStorage.getItem('user_info'));
      this.currentUser.push(tokens['id']);
      this.currentUser.push(tokens['username']);
      this.getUserGroups();
      /*this.api.get('relationship/user', {'user' : this.currentUser[0]})
      .subscribe((res) => {
        console.log("relationships", res);
      }, (err) => {
        console.log(err);
      });*/
    }

    toggleView() {
      if (this.view === 'Map') {
        this.view = 'List';
        this.altview = 'Map';
        this.router.navigate(['page-main/tab-home/postlist']);
      }
      else {
        this.view = 'Map';
        this.altview ='List';
        this.router.navigate(['page-main/tab-home/map']);
    }
  
  }

  async presentModal() {
    const modal = await this.modalController.create({
        component: ModalFilterComponent,
        cssClass: 'modal-filter'
    });
    return await modal.present();
}

  initListView() {
    this.dataLoaded = false;
    this.offset = 0;
    this.page = 1;
  }

    menuOpen(side: string) {
      this.menu.open(side);
  }

  menuClose() {
      this.menu.close();
  }

    getVal(val) {
      console.log(val);
    }

    goToGroup(i: number) {
      this.router.navigate(['/group'], { state: { group : this.groups[i]['id'] } });
    }

    goToProfile() {
      this.router.navigate(['/profile']);
    }

    async presentPopover(ev: any) {
      const popover = await this.popoverController.create({
        component: PopoverFilterComponent,
        event: ev,
        translucent: true
      });
      this.currentPopover = popover;
      return await popover.present();
    }

    dismissPopover() {
      if (this.currentPopover) {
        this.currentPopover.dismiss().then(() => { this.currentPopover = null; });
      }
    }

    goToMap() {
      this.router.navigate(['/map']);

    }

    ionMakePost(index: number) {
      var factory = this.resolver.resolveComponentFactory(PostTemplateComponent);
      this.componentPosts.push(this.entry.createComponent(factory));
      (<PostTemplateComponent>this.componentPosts[index].instance).data = this.allPostData[index];
      (<PostTemplateComponent>this.componentPosts[index].instance).index = index;
    }

    async ngAfterViewInit() {
      await this.loadPosts();
      await this.populatePostData();
    }

    async loadPosts() {
      this.infiniteScroll.disabled = true;
      await this.api.refreshToken();
      return new Promise((resolve) => {
        let posts = this.api.get('posts/ordered/newest/?page=' + this.page);
        posts.subscribe((res) => {
          console.log("Posts", res);
          this.posts = res['results'];
          this.postCount = this.postCount + this.posts.length;
          this.page++;
          resolve();
        }, (err) => {
          this.presentSomethingWrongToast();
        });
      });
    }

    async populatePostData() {
      var len = this.posts.length;
      var index: number;

      this.dataLoaded = true;
      for (index = 0; index < len; index++) {
        this.allPostData.push(new postData());
        await this.getUserDetails(this.posts[index]['user']);
        await this.getLikeDetails(this.posts[index]['id']);
        await this.getPostComments(this.posts[index]['id']);
        await this.getAddress(this.posts[index]['Latitude'], this.posts[index]['Longitude']);
        await this.getPostDetails(index);
        this.ionMakePost(this.offset);
        this.offset++;
      }
      this.infiniteScroll.disabled = false;
    }

    async getPostDetails(index: number) {
      return new Promise((resolve) => {
        this.allPostData[this.offset]['body'] = this.posts[index]['body'];
        this.allPostData[this.offset]['id'] = this.posts[index]['id'];
        this.allPostData[this.offset]['date'] = this.posts[index]['posted_at'];
        this.allPostData[this.offset]['categories'] = this.posts[index]['categories'];
        resolve();
      });
    }

    async getUserDetails(user: string) {
      await this.api.refreshToken();
      return new Promise((resolve) => {
        this.api.get('users/' + user + '/')
        .subscribe((res) => {
          this.allPostData[this.offset]['username'] = res['username'];
          this.allPostData[this.offset]['userId'] = res['id'];
          this.allPostData[this.offset]['avatar'] = res['image'];
          resolve();
        });
      });
    }

    async getLikeDetails(post: number) {
      await this.api.refreshToken();
      return new Promise((resolve) => {
        this.api.get('posts/likes/' + post + '/')
        .subscribe((res:any) => {
          this.allPostData[this.offset]['likes'] = res['count'];
          this.allPostData[this.offset]['liked'] = false;
          res['results'].forEach((element) => {
            if (element['user'] == this.currentUser[0]) {
              this.allPostData[this.offset]['liked'] = true;
            }
          });
          resolve();
        });
      });
    }

    async getPostComments(post: number) {
      await this.api.refreshToken();
      return new Promise((resolve) => {
        this.api.get('posts/comments/' + post + '/')
        .subscribe((res:any) => {
          this.allPostData[this.offset]['comments'] = res['count'];
          resolve();
        });
      });
    }

    async getAddress(latitude: number, longitude: number) {
      const searchTerm = longitude.toString() + ',' + latitude.toString();
      return new Promise((resolve) => {
        this.mapboxService
          .searchCoords(searchTerm)
          .subscribe((res)=> {
            var addr: string;
            if (res.length == 0){
              addr = "[" + (latitude).toString() + ","
                + (longitude).toString() + "]";
            } else {
              addr = res[0].place_name;
            }
            this.allPostData[this.offset]['address'] = addr;
            resolve();
        });
      });
    }

    async getCurrentPosition() {
      const coordinates = await Geolocation.getCurrentPosition();
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

    segmentChanged(ev: any) {
      this.getCurrentPosition();
    }

    changeView() {
      if (this.view == "0") {
        this.hide = true;
      } else {
        this.hide = false;
      }
    }

    async loadData(event) {
      await this.loadPosts();
      await this.populatePostData();
      setTimeout(() => {

        event.target.complete();
      }, 500);
    }

    async getUserGroups() {
      await this.api.refreshToken();
      this.api.get('grouping/1/user')
      .subscribe((res) => {
        res['results'].forEach(element => {
          let gr = new group();
          gr.name = element['name'];
          gr.id = element['id'];
          this.groups.push(gr);
        });
        this.groupsLoaded = true;
      }); 
    }

    async viewUser(index: number) {
      console.log(this.allPostData[index]['userId']);
    }

    viewPostComments(index: number) {
      console.log(this.posts[index]);
    }

    toggleInfiniteScroll() {
        this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
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
