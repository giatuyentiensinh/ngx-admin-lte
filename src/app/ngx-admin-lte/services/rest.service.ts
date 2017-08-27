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

  private onMsgNews: ioEvent;
  private onObsBtn: ioEvent;

  constructor(private http: Http, private socket: IO) {

    this.onMsgNews = new ioEvent('msg');
    this.socket.listenToEvent(this.onMsgNews);
    this.onObsBtn = new ioEvent('obj');
    this.socket.listenToEvent(this.onObsBtn);
    this.socket.connect('http://' + window.location.hostname + ':9092');

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

  public streamIO(): Observable<any> {
    return this.onMsgNews.event$;
  }
  public streamObserveCoAP(): Observable<any> {
    return this.onObsBtn.event$;
  }

  public controlObj(request): Observable<any> {
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
        const ips = [];
        xml2js.parseString(res['_body'], function(err, param) {
          for (const e of param.obj.str) {
            ips.push(e['$'].val);
          }
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
        const xml = res.json()['m2m:cin'].con;
        let result;
        let adc1, adc2, adc3, battery, temperature, sensor_temperature, sensor_humidity;
        xml2js.parseString(xml, function(err, param) {
          for (const item of param.obj.int) {
            if ('adc1' === item['$'].name) {
              adc1 = item['$'].val;
            }
            if ('adc2' === item['$'].name) {
              adc2 = item['$'].val;
            }
            if ('adc3' === item['$'].name) {
              adc3 = item['$'].val;
            }
            if ('battery' === item['$'].name) {
              battery = item['$'].val;
            }
            if ('temperature' === item['$'].name) {
              temperature = item['$'].val;
            }
            if ('sensor_temperature' === item['$'].name) {
              sensor_temperature = item['$'].val;
            }
            if ('sensor_humidity' === item['$'].name) {
              sensor_humidity = item['$'].val;
            }
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
      .catch(err => {
        if (err.status === 404) {
          return Observable.throw('First data not fould in RE-Mote/DATA');
        }
        return Observable.throw(err.json().error);
      });
  }


  public getAllData(application_name): Observable<any> {

    // Get data from cache.
    const json = localStorage.getItem('rest_all_om2m');
    // cache time is 2 minute.
    const cacheTime = 2 * 60000;
    if (json) {
      const obj = JSON.parse(json);
      if (Date.now() - obj.date < cacheTime) {
        return Observable.of(obj.data);
      }
    }
    // If cache expire then get from http.
    return this.http.get('/~/' + this.modelName + '/' + application_name + '/DATA?rcn=4', {
      headers: this.headers
    })
      .map(res => {
        const xml = res.json()['m2m:cnt']['cin'];
        const result: any[] = [];
        for (const e of xml) {
          xml2js.parseString(e.con, function(err, param) {
            let adc1, adc2, adc3, battery, temperature, sensor_temperature, sensor_humidity, addr, time;
            for (const item of param.obj.int) {
              switch (item['$'].name) {
                case 'adc1':
                  adc1 = item['$'].val;
                  time = e.lt;
                  break;
                case 'adc2':
                  adc2 = item['$'].val;
                  break;
                case 'adc3':
                  adc3 = item['$'].val;
                  break;
                case 'battery':
                  battery = item['$'].val;
                  break;
                case 'temperature':
                  temperature = item['$'].val;
                  break;
                case 'sensor_temperature':
                  sensor_temperature = item['$'].val;
                  break;
                case 'sensor_humidity':
                  sensor_humidity = item['$'].val;
                  break;
                default:
                  break;
              }
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
        localStorage.setItem('rest_all_om2m', JSON.stringify({ data: result, date: Date.now() }));
        return result;
      })
      .catch(err => {
        if (err.message === 'xml_1 is undefined') {
          return Observable.throw('RE-Mote/DATA is empty');
        }
        return Observable.throw(err.json().error)
      });
  }

  private handleError(error: Response) {
    // console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
