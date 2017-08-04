import { Component, OnInit } from '@angular/core';
import { CompleterService, CompleterData } from 'ng2-completer';
import { NotificationService, RestService } from '../../ngx-admin-lte/index';
@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {

  searchProcess: boolean = true;

  redStatus: boolean = false;
  greenStatus: boolean = false;
  blueStatus: boolean = false;

  searchIp: string;
  sensorIps: string[] = [];
  sensorIp: string;

  protected dataService: CompleterData;

  constructor(private noServ: NotificationService,
    private rest: RestService,
    private completerService: CompleterService) {
    this.dataService = completerService.local([
      { ip: 'aaaa::212:4b00:9df:4f53', value: 'aaaa::212:4b00:9df:4f53' },
      { ip: 'aaaa::212:4b00:615:a974', value: 'aaaa::212:4b00:615:a974' },
      { ip: 'fd00::212:4b00:9df:4f53', value: 'fd00::212:4b00:9df:4f53' },
      { ip: 'fd00::212:4b00:615:a974', value: 'fd00::212:4b00:615:a974' }
    ], 'ip', 'value');
  }

  ngOnInit() {}

  searchIP() {
    this.searchProcess = true;
    this.sensorIp = null;
    this.rest.searchIp(this.searchIp).subscribe(res => {
      console.log(res);
      this.sensorIps = res;
      this.searchProcess = false;
    });
  }

  toggleRedLed() {
    this.redStatus = !this.redStatus;
    if (this.redStatus)
      this.rest.ledControl('setOnLebRed&addr=' + this.sensorIp)
        .subscribe(res => this.noServ.success('The Red led is turn on', 'Notification'));
    else
      this.rest.ledControl('setOffLebRed&addr=' + this.sensorIp)
        .subscribe(res => this.noServ.success('The Red led is turn off', 'Notification'));
  }

  toggleGreenLed() {
    this.greenStatus = !this.greenStatus;
    if (this.greenStatus)
      this.rest.ledControl('setOnLebGreen&addr=' + this.sensorIp)
        .subscribe(res => this.noServ.success('The Green led is turn on', 'Notification'));
    else
      this.rest.ledControl('setOffLebGreen&addr=' + this.sensorIp)
        .subscribe(res => this.noServ.success('The Green led is turn off', 'Notification'));
  }

  toggleBlueLed() {
    this.blueStatus = !this.blueStatus;
    if (this.blueStatus)
      this.rest.ledControl('setOnLebBlue&addr=' + this.sensorIp)
        .subscribe(res => this.noServ.success('The Blue led is turn on', 'Notification'));
    else
      this.rest.ledControl('setOffLebBlue&addr=' + this.sensorIp)
        .subscribe(res => this.noServ.success('The Blue led is turn off', 'Notification'));
  }

  selectIp(ip) {
    this.sensorIp = ip;
  }

}
