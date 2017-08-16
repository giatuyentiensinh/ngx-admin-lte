import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RestService } from '../../../ngx-admin-lte/index';

@Component({
  selector: 'chart-bar',
  templateUrl: './bar.component.html'
})
export class BarComponent {

  public barChartLabels: string[] = [];
  public barChartDataADC: any[] = [];
  public barChartDataBattery: any[] = [];
  public datas: any[] = [];

  constructor(public rest: RestService,
    private datePipe: DatePipe) {

    rest.getAllData('RE-Mote').subscribe(res => {
      let adc1s: number[] = [];
      let adc3s: number[] = [];
      let battery: number[] = [];
      let times: any[] = [];
      res.map(item => {
        adc1s.push(item.adc1 / 1000);
        adc3s.push(item.adc3 / 1000);
        battery.push(item.battery / 1000);
        times.push(this.datePipe.transform(item.time, 'mm:ss'));
      });
      this.barChartDataADC = [{ data: adc1s, label: 'ADC1' }, { data: adc3s, label: 'ADC3' }];
      this.barChartDataBattery = [{ data: battery, label: 'Battery' }];
      this.barChartLabels = times;
      this.datas = res;
    });
  }

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
}
