import { Component, OnInit, Input, ComponentFactoryResolver, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastController, NavController } from '@ionic/angular';
import { MBService, Feature } from 'src/services/mapbox/mapbox.service';

import { user } from '../../../models/users';
import { ApiDjangoService } from 'src/services/api/api-django.service';
import { post } from 'src/models/posts';
import { Router } from '@angular/router';
import { PostTemplateComponent } from 'src/app/components/post-template/post-template.component';
import { IonInfiniteScroll } from '@ionic/angular';

let length = 0;
const list = document.getElementById('list');
const infiniteScroll = document.getElementById('infinite-scroll');

class postData {
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
}

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit, AfterViewInit {

@ViewChild('postContainer', { read: ViewContainerRef }) entry:ViewContainerRef;
@ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  postuser = new user;
  groupId: number;
  groupName: string;
  members: number;

  currentUser: string[] = [];
  allPostData: postData[] = [];
  currentPost: post;

  page: number = 1;
  posts: any;
  offset: number = 0;
  postCount: number = 0;

  dataLoaded: boolean;
  postLoaded: boolean[]  = [];
  postLiked: boolean[] = [];

  memberCount: number;
  allPostCount: number;

  constructor(
    private router: Router, 
    private mapboxService: MBService,
    public translateService: TranslateService,
    private toastCtrl: ToastController,
    public api: ApiDjangoService,
    private resolver: ComponentFactoryResolver,
    public navCtrl: NavController
  ) { 
  }
  
  infinitescroll = infiniteScroll;

  async ngOnInit() {
    this.groupId = this.router.getCurrentNavigation().extras.state.group;
    await this.getGroupData();
  }

  async ngAfterViewInit() {
    //this.getGroupDetails();
    await this.loadGroupPosts();
    await this.populatePostData();
  }

  async getGroupData() {
    await this.api.refreshToken();
    return new Promise (() => {
      this.api.get('groups/' + this.groupId + '/')
      .subscribe((res) => {
        this.groupName = res['name'];
        this.members = res['members'].length;
      });
    });
  }

  ionMakePost(index: number) {
    var factory = this.resolver.resolveComponentFactory(PostTemplateComponent);
    let comp = this.entry.createComponent(factory);
    (<PostTemplateComponent>comp.instance).data = this.allPostData[index];
    (<PostTemplateComponent>comp.instance).index = index;
  }

  async loadGroupPosts() {
    this.infiniteScroll.disabled = true;
    await this.api.refreshToken();
      return new Promise((resolve) => {
        let posts = this.api.get('grouping/posts/' + this.groupId + '/group?page=' + this.page);
        posts.subscribe((res) => {
          this.posts = res['results'];
          let count = res['count'];
          this.postCount = count;
          resolve();
        });
      });
  }

  async populatePostData() {
    var len = this.posts.length;
    var index: number;

    this.dataLoaded = true; 
    for (index = 0; index < len; index++) {
      this.allPostData.push(new postData());
      await this.getPost(this.posts[index]['post']);
      await this.getUserDetails(this.currentPost['user']);
      await this.getLikeDetails(this.currentPost['id']);
      await this.getPostComments(this.currentPost['id']);
      await this.getAddress(this.currentPost['Latitude'], this.currentPost['Longitude']);
      await this.getPostDetails(index);
      this.postLoaded[index] = true;
      this.ionMakePost(this.offset);
      this.offset++;
    }
    this.page++;
    this.infiniteScroll.disabled = false;
  }

  async getPost(id: number) {
    return new Promise((resolve) => {
      this.api.get('posts/' + id + '/')
      .subscribe((res:any) => {
        this.currentPost = <post>res;
        resolve();
      }, (err) => {
        resolve();
      });
    });
  }

  async getPostDetails(index: number) {
    return new Promise((resolve) => {
      this.allPostData[this.offset]['body'] = this.currentPost['body'];
      this.allPostData[this.offset]['id'] = this.currentPost['id'];
      this.allPostData[this.offset]['date'] = this.currentPost['posted_at'];
      this.allPostData[this.offset]['categories'] = this.currentPost['categories'];
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

  async loadData(event) {
    await this.loadGroupPosts();
    await this.populatePostData();
    setTimeout(() => {

      event.target.complete();
    }, 500);
  }

  editGroup() {
    this.router.navigate(['/group-edit'],  { state: { 
      group : this.groupId ,
      //name : this.groups[]
    }});
  }

}

