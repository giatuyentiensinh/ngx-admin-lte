import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RestService } from '../../../ngx-admin-lte/index';

@Component({
  selector: 'chart-line',
  templateUrl: './line.component.html'
})
export class LineComponent {

  public datas: any[] = [];

  constructor(public rest: RestService,
    private datePipe: DatePipe) {
    rest.getAllData('RE-Mote').subscribe(res => {
      let datastemp: number[] = [];
      let datashumi: number[] = [];
      let times: any[] = [];
      this.datas = res;
      res.map(item => {
        if (item.sensor_temperature) {
          datastemp.push(item.sensor_temperature / 1000);
          datashumi.push(item.sensor_humidity);
          times.push(this.datePipe.transform(item.time, 'hh:mm:ss'));
        }
      });
      if (datastemp.length > 0) {
        this.lineChartDataTemp = [{ data: datastemp, label: 'Temperature sensor (°C)' }];
        this.lineChartDataHumi = [{ data: datashumi, label: 'Humidity sensor (%)' }];
        this.lineChartLabels = times;
      }
    });
  }

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
}
