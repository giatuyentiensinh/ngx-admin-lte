import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RestService } from '../../../ngx-admin-lte/index';
import { Subscription } from 'rxjs/Subscription';

const MAX_RECORDS: number = 20;

@Component({
  selector: 'chart-line',
  templateUrl: './line.component.html'
})
export class LineComponent implements OnInit, OnDestroy {

  public lineChartDataTemp: Array<any> = [];
  public lineChartDataHumi: Array<any> = [];
  public lineChartLabels: Array<any> = [];

  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColorTemp: Array<any> = [{
    backgroundColor: 'rgba(236, 9, 9, 0.46)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }];
  public lineChartColorHumi: Array<any> = [{
    backgroundColor: 'rgba(9, 149, 236, 0.47)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  // data
  public datas: any[] = [];
  private subscribe: Subscription;

  constructor(public rest: RestService,
    private datePipe: DatePipe) { }

  public ngOnInit() {
    this.rest.getAllData('RE-Mote').subscribe(res => {
      let datastemp: number[] = [];
      let datashumi: number[] = [];
      let times: any[] = [];
      res = res.slice(0, MAX_RECORDS);
      this.datas = res;
      res.map(item => {
        if (item.sensor_temperature) {
          datastemp.push(item.sensor_temperature / 10);
          datashumi.push(item.sensor_humidity / 10);
          times.push(this.datePipe.transform(item.time, 'hh:mm:ss'));
        }
      });

      if (datastemp.length > 0) {
        this.lineChartDataTemp = [{ data: datastemp, label: 'Temperature sensor (°C)' }];
        this.lineChartDataHumi = [{ data: datashumi, label: 'Humidity sensor (%)' }];
        this.lineChartLabels = times;
      }

      this.subscribe = this.rest.streamIO().subscribe(data => {
        if (this.lineChartDataTemp[0].data.length > MAX_RECORDS) {
          this.lineChartLabels.shift();
          this.lineChartDataHumi[0].data.shift();
          this.lineChartDataTemp[0].data.shift();
        }

        this.lineChartDataTemp[0].data.push(data.sensor_temperature / 10);
        this.lineChartDataHumi[0].data.push(data.sensor_humidity / 10);
        this.lineChartLabels.push(this.datePipe.transform(new Date(), 'hh:mm:ss'));
        this.datas.push({
          sensor_humidity: data.sensor_humidity,
          sensor_temperature: data.sensor_temperature,
          time: new Date()
        });

        this.lineChartDataTemp = [{ data: this.lineChartDataTemp[0].data, label: 'Temperature sensor (°C)' }];
        this.lineChartDataHumi = [{ data: this.lineChartDataHumi[0].data, label: 'Humidity sensor (%)' }];
      });
    });

  }

  public ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }

}
