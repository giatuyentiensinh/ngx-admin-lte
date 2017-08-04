export class Temperature {
  public temp: number;
  public time: any;

  public constructor(data: any = {}) {
    this.temp = data.temp || '';
    this.time = data.time || Date.now();
  }
}
