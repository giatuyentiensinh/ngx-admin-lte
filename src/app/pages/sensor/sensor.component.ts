import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbService } from '../../ngx-admin-lte/index';


@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html'
})
export class SensorComponent implements OnInit, OnDestroy {

  constructor(
    private breadServ: BreadcrumbService
  ) { }

  ngOnInit() {
    this.breadServ.set({
      header: 'Sensor',
      description: 'This is sensor page',
      display: true,
      levels: [
        {
          icon: 'home',
          link: ['/'],
          title: 'Home'
        },
        {
          icon: 'stethoscope',
          link: ['/sensor'],
          title: 'Sensor'
        }
      ]
    });
  }

  public ngOnDestroy() {
    this.breadServ.clear();
  }
}
