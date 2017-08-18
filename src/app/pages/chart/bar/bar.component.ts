import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RestService } from '../../../ngx-admin-lte/index';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'chart-bar',
  templateUrl: './bar.component.html'
})
export class BarComponent implements OnInit, OnDestroy {

  public barChartLabels: string[] = [];
  public barChartDataADC: any[] = [];
  public barChartDataBattery: any[] = [];
  public datas: any[] = [];

  constructor(public rest: RestService,
    private datePipe: DatePipe) { }

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  private subscribe: Subscription;

  public ngOnInit() {
    this.rest.getAllData('RE-Mote').subscribe(res => {
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

      this.subscribe = this.rest.streamIO().subscribe(data => {
        this.barChartDataADC[0].data.push(data.adc1 / 1000);
        this.barChartDataADC[1].data.push(data.adc3 / 1000);
        this.barChartDataBattery[0].data.push(data.battery / 1000);
        this.barChartLabels.push(this.datePipe.transform(new Date(), 'mm:ss'));
        this.barChartDataADC = [{ data: this.barChartDataADC[0].data, label: 'ADC1' }, { data: this.barChartDataADC[1].data, label: 'ADC3' }];
        this.barChartDataBattery = [{ data: this.barChartDataBattery[0].data, label: 'Battery' }];
        this.datas.unshift({
          adc1: data.adc1,
          adc2: data.adc2,
          adc3: data.adc3,
          battery: data.battery,
          time: new Date()
        });
      });

    });
  }

  public ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }
}
