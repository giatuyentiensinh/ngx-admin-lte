import { Component, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RestService } from '../../../ngx-admin-lte/index';
import { Observable } from 'rxjs';


@Component({
  selector: 'chart-line',
  templateUrl: './line.component.html'
})
export class LineComponent implements OnDestroy {

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
          datastemp.push(item.sensor_temperature / 100);
          datashumi.push(item.sensor_humidity / 100);
          times.push(this.datePipe.transform(item.time, 'hh:mm:ss'));
        }
      });
      if (datastemp.length > 0) {
        this.lineChartDataTemp = [{ data: datastemp, label: 'Temperature sensor (°C)' }];
        this.lineChartDataHumi = [{ data: datashumi, label: 'Humidity sensor (%)' }];
        this.lineChartLabels = times;
      }
    });
    // this.subscribeToData();
  }

  // private refreshData(): void {
  //   this.dataSubscription = this.rest.getFirstData('RE-Mote').subscribe(res => {
  //     // console.log(res.sensor_temperature);
  //     let datastemp = [];
  //     let datashumi = [];
  //     let times = [];
  //     for (let i = 1; i < this.lineChartDataTemp[0].data.length; i++)
  //       datastemp.push(this.lineChartDataTemp[0].data[i]);
  //     for (let i = 1; i < this.lineChartDataHumi[0].data.length; i++){
  //       // times.push(this.lineChartLabels[i]);
  //       datashumi.push(this.lineChartDataHumi[0].data[i]);
  //     }
  //     // times.push(this.datePipe.transform(new Date(), 'hh:mm:ss'));
  //     datastemp.push(res.sensor_temperature / 100);
  //     datashumi.push(res.sensor_humidity / 100);
  //     this.lineChartDataTemp = [{ data: datastemp, label: 'Temperature sensor (°C)' }];
  //     this.lineChartDataHumi = [{ data: datashumi, label: 'Humidity sensor (%)' }];
  //     // this.lineChartLabels = times;
  //     this.subscribeToData();
  //   });
  // }

  // private subscribeToData(): void {
  //   this.timerSubscription = Observable.timer(1000).first().subscribe(() => this.refreshData());
  // }

  public ngOnDestroy(): void {
    // if (this.dataSubscription) {
    //   this.dataSubscription.unsubscribe();
    // }
    // if (this.timerSubscription) {
    //   this.timerSubscription.unsubscribe();
    // }
  }

  // private timerSubscription: any;
  // private dataSubscription: any;

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
