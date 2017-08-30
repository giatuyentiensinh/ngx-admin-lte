import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, BreadcrumbService, RestService } from '../../ngx-admin-lte/index';
import * as xml2js from 'xml2js';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

  private temp: string;
  private humi: number;
  private tempOnBoard: number;
  private battery: number;

  private datas: any[];

  private timerSubscription: any;
  private dataSubscription: any;
  private subscribe: Subscription;

  constructor(private notification: NotificationService,
    private rest: RestService,
    private breadServ: BreadcrumbService) {
  }

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
          link: ['/'],
          title: 'dashboard'
        }
      ]
    });

    this.rest.getAllData('RE-Mote').subscribe(res => {
      this.datas = res;
      if (res[res.length - 1].sensor_temperature) {
        this.temp = '' + res[res.length - 1].sensor_temperature / 10;
        this.humi = res[res.length - 1].sensor_humidity / 10;
      }
      this.battery = res[res.length - 1].battery / 1000;
      this.tempOnBoard = res[res.length - 1].temperature / 1000;

      this.datas = this.datas.reverse();

      this.subscribe = this.rest.streamIO().subscribe(data => {
        if (data.sensor_temperature) {
          this.temp = '' + data.sensor_temperature / 10;
          this.humi = data.sensor_humidity / 10;
        }
        this.battery = data.battery / 1000;
        this.tempOnBoard = data.temperature / 1000;
        this.datas.unshift({
          adc1: data.adc1,
          adc2: data.adc2,
          adc3: data.adc3,
          battery: data.battery,
          temperature: data.temperature,
          sensor_temperature: data.sensor_temperature,
          sensor_humidity: data.sensor_humidity,
          addr: data.addr,
          time: new Date()
        });
      });
    }, err => {
      this.notification.error(err, 'Error');
    });

    this.rest.streamObserveCoAP().subscribe(data => {
      this.notification.success(JSON.stringify(data), 'CoAP Observe');
    });

  }

  public ngOnDestroy() {
    this.breadServ.clear();
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
    const json = localStorage.getItem('rest_all_om2m');
    if (json) {
      localStorage.setItem('rest_all_om2m', JSON.stringify({
       data: this.datas,
       date: JSON.parse(localStorage.getItem('rest_all_om2m')).date
      }));
      // console.log(JSON.parse(localStorage.getItem('rest_all_om2m')).data.length);
    }
  }
}
