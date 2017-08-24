import { Component, OnInit } from '@angular/core';
import { CompleterService, CompleterData } from 'ng2-completer';
import { BreadcrumbService, NotificationService, RestService } from '../../ngx-admin-lte/index';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {

  searchProcess = true;

  redStatus = false;
  greenStatus = false;
  blueStatus = false;
  obsStatus = false;

  searchIp: string;
  sensorIps: string[] = [];
  sensorIp: string;

  protected dataService: CompleterData;

  constructor(private noServ: NotificationService,
    private breadServ: BreadcrumbService,
    private rest: RestService,
    private completerService: CompleterService) {
    this.dataService = completerService.local([
      { ip: 'aaaa::212:4b00:', value: 'aaaa::212:4b00:' },
      { ip: 'aaaa::212:4b00:9df:4f53', value: 'aaaa::212:4b00:9df:4f53' },
      { ip: 'aaaa::212:4b00:615:a974', value: 'aaaa::212:4b00:615:a974' },
      { ip: 'fd00::212:4b00:9df:4f53', value: 'fd00::212:4b00:9df:4f53' },
      { ip: 'fd00::212:4b00:615:a974', value: 'fd00::212:4b00:615:a974' }
    ], 'ip', 'value');
  }

  ngOnInit() {
    this.breadServ.set({
      header: 'Control',
      display: true,
      levels: [
        {
          icon: 'home',
          link: ['/'],
          title: 'Home'
        },
        {
          icon: 'wifi',
          link: ['/control'],
          title: 'Control'
        }
      ]
    });
  }

  searchIP() {
    this.searchProcess = true;
    this.sensorIp = null;
    this.rest.searchIp(this.searchIp).subscribe(res => {
      // console.log(res);
      this.sensorIps = res;
      this.searchProcess = false;
    });
  }

  toggleRedLed() {
    this.redStatus = !this.redStatus;
    if (this.redStatus) {
      this.rest.controlObj('setOnLebRed&addr=' + this.sensorIp)
        .subscribe(res => this.noServ.success('The Red led is turn on', 'Notification'));
    } else {
      this.rest.controlObj('setOffLebRed&addr=' + this.sensorIp)
        .subscribe(res => this.noServ.success('The Red led is turn off', 'Notification'));
    }
  }

  toggleGreenLed() {
    this.greenStatus = !this.greenStatus;
    if (this.greenStatus) {
      this.rest.controlObj('setOnLebGreen&addr=' + this.sensorIp)
        .subscribe(res => this.noServ.success('The Green led is turn on', 'Notification'));
    } else {
      this.rest.controlObj('setOffLebGreen&addr=' + this.sensorIp)
        .subscribe(res => this.noServ.success('The Green led is turn off', 'Notification'));
    }
  }

  toggleBlueLed() {
    this.blueStatus = !this.blueStatus;
    if (this.blueStatus) {
      this.rest.controlObj('setOnLebBlue&addr=' + this.sensorIp)
        .subscribe(res => this.noServ.success('The Blue led is turn on', 'Notification'));
    } else {
      this.rest.controlObj('setOffLebBlue&addr=' + this.sensorIp)
        .subscribe(res => this.noServ.success('The Blue led is turn off', 'Notification'));
    }
  }

  toggleGPIO() {
    this.rest.controlObj('gpio&addr=' + this.sensorIp)
      .subscribe(res => this.noServ.success('Request success', 'Notification'));
  }

  toggleObsBtn() {
    this.obsStatus = !this.obsStatus;
    if (this.obsStatus) {
      this.rest.controlObj('observeBtnActive&addr=' + this.sensorIp)
        .subscribe(res => this.noServ.success('Observer button is turn on', 'Notification'));
    } else {
      this.rest.controlObj('observeBtnCancel&addr=' + this.sensorIp)
        .subscribe(res => this.noServ.success('Observer button is turn off', 'Notification'));
    }
  }

  selectIp(ip) {
    this.sensorIp = ip;
  }

}
