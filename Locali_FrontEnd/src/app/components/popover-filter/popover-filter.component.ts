import { Component, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { DateTimeService } from 'src/services/dateTime/date-time.service';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-popover-filter',
  templateUrl: './popover-filter.component.html',
  styleUrls: ['./popover-filter.component.scss'],
})
export class PopoverFilterComponent implements OnInit {

  public mintime = '';
  public maxtime = '';

  filter = {


  }
  distance: number = 5;

  popoverContent: any[];
  automaticClose = false;

  constructor(
    private popoverContoller: PopoverController,
    private http: HttpClient,
    private datetime: DateTimeService,
  ) {
    this.http.get('./assets/filter.json').subscribe(res => {
      this.popoverContent = res['items'];
      console.log(this.popoverContent);
    })
  }

  ngOnInit() {
    this.mintime = '2020-05-01';
    console.log(this.mintime);
    this.maxtime = this.datetime.getDateLeadingZeros();
    console.log(this.maxtime);

  }

  toggleFilterItem(index: any) {
    this.popoverContent[index].open = !this.popoverContent[index].open;

    if (this.automaticClose && this.popoverContent[index].open) {
      this.popoverContent
      .filter((item, itemIndex) => itemIndex != index)
      .map(item => item.open = false);
    }
  }

  dismissPopover() {
    this.popoverContoller.dismiss();
  }

}
