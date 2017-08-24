import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RestService } from '../../../ngx-admin-lte/index';
import { Subscription } from 'rxjs/Subscription';

const MAX_RECORDS = 20;

@Component({
  selector: 'chart-bar',
  templateUrl: './bar.component.html'
})
export class BarComponent implements OnInit, OnDestroy {

  public barChartLabels: string[] = [];
  public barChartDataADC: any[] = [];
  public barChartDataBattery: any[] = [];
  public datas: any[] = [];

  public loadDataProcess = true;
  private subscribe: Subscription;

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartType = 'bar';
  public barChartLegend = true;


  constructor(public rest: RestService,
    private datePipe: DatePipe) { }


  public ngOnInit() {
    this.loadDataProcess = true;
    this.rest.getAllData('RE-Mote').subscribe(res => {
      const adc1s: number[] = [];
      const adc3s: number[] = [];
      const battery: number[] = [];
      const times: any[] = [];
      res = res.slice(0, MAX_RECORDS);
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
      this.loadDataProcess = false;

      this.subscribe = this.rest.streamIO().subscribe(data => {

        if (this.barChartDataADC[0].data.length > MAX_RECORDS) {
          this.barChartLabels.shift();
          this.barChartDataADC[0].data.shift();
          this.barChartDataADC[1].data.shift();
          this.barChartDataBattery[0].data.shift();
        }

        this.barChartDataADC[0].data.push(data.adc1 / 1000);
        this.barChartDataADC[1].data.push(data.adc3 / 1000);
        this.barChartDataBattery[0].data.push(data.battery / 1000);
        this.barChartLabels.push(this.datePipe.transform(new Date(), 'mm:ss'));
        this.barChartDataADC = [
          { data: this.barChartDataADC[0].data, label: 'ADC1' },
          { data: this.barChartDataADC[1].data, label: 'ADC3' }
        ];
        this.barChartDataBattery = [{ data: this.barChartDataBattery[0].data, label: 'Battery' }];
        this.datas.unshift({
          time: new Date(),
          adc1: data.adc1,
          adc2: data.adc2,
          adc3: data.adc3,
          battery: data.battery
        });
      });

    });
  }

  public ngOnDestroy(): void {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }
}
