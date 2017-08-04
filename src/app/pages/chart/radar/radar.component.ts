import { Component, OnInit } from '@angular/core';
import { RestService } from '../../../ngx-admin-lte/index';
@Component({
  selector: 'chart-radar',
  templateUrl: './radar.component.html'
})
export class RadarComponent implements OnInit {

  constructor(public rest: RestService) {
    this.rest.getFirstData('RE-Mote').subscribe(res => {
      this.radarChartData = [{
        data: [
          res.adc1 / 1000,
          res.adc3 / 100,
          res.battery / 1000
        ],
        label: 'RE-Mote'
      }];
    });
  }

  ngOnInit() {
  }
  public radarChartLabels: string[] = ['ADC1', 'ADC3', 'Battery'];

  public radarChartData: any = [
    { data: [1.48, 0, 3.29], label: 'RE-Mote' }
  ];
  public radarChartType: string = 'radar';
}
