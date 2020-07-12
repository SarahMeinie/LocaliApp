import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  constructor() { }

  getDate() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    return date;
  }

  getDateLeadingZeros() {
    var today = new Date();
    var date = today.getFullYear()+'-'+('0'+(today.getMonth()+1)).slice(-2) +'-'+('0' + today.getDate()).slice(-2);
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
    var dateTime = date+' '+time;
    return dateTime;
  }
}
