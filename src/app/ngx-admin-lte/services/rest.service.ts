import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import * as xml2js from 'xml2js';
import { IO, ioEvent } from 'rxjs-socket.io';


@Injectable()
export class RestService {
  public modelName: string;
  private headers: Headers;
  private serverWithApiUrl: string;

  // cache data
  public lastGetAll: Array<any>;
  public lastGet: any;

  private onMsgNews: ioEvent;

  constructor(private http: Http, private socket: IO) {

    this.onMsgNews = new ioEvent("msg");
    this.socket.listenToEvent(this.onMsgNews);
    this.socket.connect('http://localhost:9092');

    // this.modelName = 'in-cse/in-name'; // for dev
    this.modelName = 'mn-cse/mn-name';
    this.headers = new Headers();
    this.headers.append('X-M2M-Origin', 'admin:admin');
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  public setApiUrl(url: string) {
    this.serverWithApiUrl = url;
  }

  // HELPERS
  public getAllFromLS(maxtime = 0): Array<any> {
    const json = localStorage.getItem('rest_all_' + this.modelName);
    if (json) {
      const obj = JSON.parse(json);
      if (obj && (obj.date < (Date.now() - maxtime))) {
        return obj;
      }
    }
  }

  public streamIO(): Observable<any> {
    return this.onMsgNews.event$;
  }

  public ledControl(request): Observable<any> {
    return this.http.post('/~/' + this.modelName + '/' + 'RE-Mote?op=' + request, {}, {
      headers: this.headers
    })
    .map(res => res)
    .catch(this.handleError);
  }

  public searchIp(ip): Observable<any> {
    return this.http.post('/~/' + this.modelName + '/' + 'RE-Mote?discovery=' + ip, {}, {
      headers: this.headers
    })
      .map(res => {
        let ips = [];
        xml2js.parseString(res['_body'], function(err, param) {
          for (let e of param.obj.str)
            ips.push(e['$'].val);
        });
        return ips;
      })
      .catch(this.handleError);
  }

  public getFirstData(application_name): Observable<any> {
    return this.http.get('/~/' + this.modelName + '/' + application_name + '/DATA/la', {
      headers: this.headers
    })
      .map(res => {
        let xml = res.json()['m2m:cin'].con;
        let result;
        let adc1, adc2, adc3, battery, temperature, sensor_temperature, sensor_humidity;
        xml2js.parseString(xml, function(err, param) {
          for (let item of param.obj.int) {
            if ('adc1' === item['$'].name)
              adc1 = item['$'].val;
            if ('adc2' === item['$'].name)
              adc2 = item['$'].val;
            if ('adc3' === item['$'].name)
              adc3 = item['$'].val;
            if ('battery' === item['$'].name)
              battery = item['$'].val;
            if ('temperature' === item['$'].name)
              temperature = item['$'].val;
            if ('sensor_temperature' === item['$'].name)
              sensor_temperature = item['$'].val;
            if ('sensor_humidity' === item['$'].name)
              sensor_humidity = item['$'].val;
          }
          result = {
            adc1: adc1,
            adc2: adc2,
            adc3: adc3,
            battery: battery,
            temperature: temperature,
            sensor_temperature: sensor_temperature,
            sensor_humidity: sensor_humidity
          };
        });
        return result;
      })
      .catch(this.handleError);
  }

  public getAllData(application_name): Observable<any> {
    return this.http.get('/~/' + this.modelName + '/' + application_name + '/DATA?rcn=4', {
      headers: this.headers
    })
      .map(res => {
        let xml = res.json()['m2m:cnt']['cin'];
        let result: any[] = [];
        for (let e of xml) {
          xml2js.parseString(e.con, function(err, param) {
            let adc1, adc2, adc3, battery, temperature, sensor_temperature, sensor_humidity, addr, time;
            for (let item of param.obj.int) {
              if ('adc1' === item['$'].name) {
                adc1 = item['$'].val;
                time = e.lt;
              }
              else if ('adc2' === item['$'].name)
                adc2 = item['$'].val;
              else if ('adc3' === item['$'].name)
                adc3 = item['$'].val;
              else if ('battery' === item['$'].name)
                battery = item['$'].val;
              else if ('temperature' === item['$'].name)
                temperature = item['$'].val;
              else if ('sensor_temperature' === item['$'].name)
                sensor_temperature = item['$'].val;
              else if ('sensor_humidity' === item['$'].name)
                sensor_humidity = item['$'].val;
              addr = param.obj.str[0]['$'].val;
            }
            result.push({
              adc1: adc1,
              adc2: adc2,
              adc3: adc3,
              battery: battery,
              temperature: temperature,
              sensor_temperature: sensor_temperature,
              sensor_humidity: sensor_humidity,
              addr: addr,
              time: time
            });
          });
        }
        // localStorage.setItem('rest_all_om2m', JSON.stringify({ data: result, date: new Date() }));
        return result;
      })
      .catch(this.handleError);
  }

  public getFromCache(id): any {
    if (this.lastGetAll) {
      return this.lastGetAll.find((unit) => unit.id === id);
    } else {
      return null;
    }
  }

  private getActionUrl() {
    return this.serverWithApiUrl + this.modelName + '/';
  }


  // REST functions
  public getAll(): Observable<any[]> {
    return this.http.get(this.getActionUrl())
      .map((response: Response) => {
        // getting an array having the same name as the model
        const data = response.json()[this.modelName];
        // transforming the array from indexed to associative
        const tab = data.records.map((elem) => {
          const unit = {};
          // using the columns order and number to rebuild the object
          data.columns.forEach((champ, index) => {
            unit[champ] = elem[index];
          });
          return unit;
        });
        this.lastGetAll = tab;
        const obj = {
          data: tab,
          date: Date.now()
        };
        localStorage.setItem('rest_all_' + this.modelName, JSON.stringify(obj));
        return tab;
      })
      .catch(this.handleError);
  }

  public get(id: number): Observable<any> {
    return this.http.get(this.getActionUrl() + id)
      .map((response: Response) => {
        const data = response.json();
        this.lastGet = data;
        return data;
      })
      .catch(this.handleError);
  }

  public add(item: any): Observable<number> {
    const toAdd = JSON.stringify(item);

    return this.http.post(this.getActionUrl(), toAdd, { headers: this.headers })
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  public addAll(tab: Array<any>): Observable<Array<number>> {
    const toAdd = JSON.stringify(tab);

    return this.http.post(this.getActionUrl(), toAdd, { headers: this.headers })
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  public update(id: number, itemToUpdate: any): Observable<number> {
    return this.http.put(this.getActionUrl() + id, JSON.stringify(itemToUpdate), { headers: this.headers })
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  public delete(id: number): Observable<Response> {
    return this.http.delete(this.getActionUrl() + id)
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
