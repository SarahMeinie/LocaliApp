import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalNewpostComponent } from '../../components/modal-newpost/modal-newpost.component';

@Component({
  selector: 'app-page-main',
  templateUrl: './page-main.page.html',
  styleUrls: ['./page-main.page.scss'],
})
export class PageMainPage implements OnInit {

    selectedPath = '';

    constructor(private route: Router,
                private modalController: ModalController
                ) {
        this.route.events.subscribe((event: RouterEvent) => {
            this.selectedPath = event.url;
        });
    }

    ngOnInit() {
        this.route.navigate(['page-main/tab-map']);
    }

    goHome() {
        this.route.navigate(['page-main/tab-map']);
    }

    async presentModal() {
        const modal = await this.modalController.create({
            component: ModalNewpostComponent
        });
        return await modal.present();
    }

}
