import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, BreadcrumbService, RestService } from '../../ngx-admin-lte/index';
import * as xml2js from 'xml2js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private temp: string;
  private humi: number;
  private light: number;
  private tempOnBoard: number;

  constructor(private noServ: NotificationService,
    private rest: RestService,
    private breadServ: BreadcrumbService) { }

  public ngOnInit() {
    this.breadServ.set({
      header: 'Dashboard',
      display: true,
      levels: [
        {
          icon: 'home',
          link: ['/'],
          title: 'Home'
        },
        {
          link: ['/sensor'],
          title: 'dashboard'
        }
      ]
    });

    // this.rest.getFirstData('TEMPERATURE_SENSOR').subscribe(res => {
    //   this.temp = res;
    // });
    // this.rest.getFirstData('HUMIDITY_SENSOR').subscribe(res => {
    //   this.humi = res;
    // });
    // this.rest.getFirstData('LIGHT_SENSOR').subscribe(res => {
    //   this.light = res;
    // });
    // this.rest.getFirstData('TEMPONBOARD_SENSOR').subscribe(res => {
    //   this.tempOnBoard = res;
    // });
    this.rest.getFirstData('RE-Mote').subscribe(res => {
      if (res.sensor_temperature) {
        this.temp = '' + res.sensor_temperature / 1000;
        this.humi = res.sensor_humidity;
      }
    });
  }

  public ngOnDestroy() {
    this.breadServ.clear();
  }
}
