import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService } from '../../../ngx-admin-lte/index';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'chart-radar',
  templateUrl: './radar.component.html'
})
export class RadarComponent implements OnInit, OnDestroy {

  public radarChartLabels: string[] = ['ADC1', 'ADC3', 'Battery'];
  public radarChartData: any = [
    { data: [0, 0, 0], label: 'RE-Mote' }
  ];
  public radarChartType: string = 'radar';

  private subscribe: Subscription;

  constructor(public rest: RestService) { }

  ngOnInit() {
    this.rest.getFirstData('RE-Mote').subscribe(res => {
      this.radarChartData = [{
        data: [
          res.adc1 / 1000,
          res.adc3 / 1000,
          res.battery / 1000
        ],
        label: 'RE-Mote'
      }];
    });
    this.subscribe = this.rest.streamIO().subscribe(data => {
      this.radarChartData = [{
        data: [
          data.adc1 / 1000,
          data.adc3 / 1000,
          data.battery / 1000
        ],
        label: 'RE-Mote'
      }];
    });
  }

  public ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }

}
