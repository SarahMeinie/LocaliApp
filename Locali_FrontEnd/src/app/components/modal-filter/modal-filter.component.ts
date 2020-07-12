import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { DateTimeService } from 'src/services/dateTime/date-time.service';
import { filter, defaults } from 'src/models/filter'
import { Router } from '@angular/router'


@Component({
  selector: 'app-modal-filter',
  templateUrl: './modal-filter.component.html',
  styleUrls: ['./modal-filter.component.scss'],
})
export class ModalFilterComponent implements OnInit {

  filters = new filter;

  nearestfill = 'outline';
  newestfill = 'outline';
  fill2 = 'outline';
  fill5 = 'outline';
  fill10 = 'outline';
  fillinf = 'outline';

  public mintime = '2020-05-01';
  public maxtime = '';

  modalContent: any[];

  constructor(
    private modalController: ModalController,
    private http: HttpClient,
    private datetime: DateTimeService,
    private router: Router
  ) {
    this.http.get('./assets/filter.json').subscribe(res => {
      this.modalContent = res['items'];
      console.log(this.modalContent);
    })
  }

  ngOnInit() {
    this.maxtime = this.datetime.getDateLeadingZeros();
    this.reset();
    console.log(this.filters.sort);
  }

  toggleSort(but: string) {
    this.nearestfill = 'outline';
    this.newestfill = 'outline';
    
    switch(but) {
      case 'Nearest': {
        this.filters.sort = 'Nearest';
        this.nearestfill = 'solid'; 
        
        break;
      }
      case 'Newest': {
        this.filters.sort = 'Newest';
        this.newestfill = 'solid'; 
        
        break;
      }
    }
  }

  toggleDistance(but: number) {
    this.fill2 = 'outline';
    this.fill5 = 'outline';
    this.fill10 = 'outline';
    this.fillinf = 'outline';
    switch(but) { 
      case 2: { 
        this.filters.distance = 2;
        this.fill2 = 'solid';

         break; 
      } 
      case 5: { 
        this.filters.distance = 5; 
        this.fill5 = 'solid';
         break; 
      } 
      case 10: { 
        this.filters.distance = 10; 
        this.fill10 = 'solid';
        break; 
     } 
     case null: { 
      this.filters.distance = null;
      this.fillinf = 'solid';
      break; 
   } 
   } 
  }

  selectCategories() {
 this.router.navigate(['/select-categories']);
  }

  selectUser() {
    
  }

  reset() {
    this.filters.sort = defaults.sort;
    this.filters.distance = defaults.distance;
    this.filters.categories = defaults.categories;
    this.filters.user = defaults.user;

    this.toggleSort(this.filters.sort);
    this.toggleDistance(this.filters.distance);
  }

  apply() {
    //
    this.dismissModal();
  }


  async dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    await this.modalController.dismiss({
      'dismissed': true
    });
  }

}
