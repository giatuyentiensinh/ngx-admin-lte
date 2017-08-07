import { Component, OnInit } from '@angular/core';
import {
  User, MenuService,
  Message, MessagesService,
  NotificationService, LogoService
} from './ngx-admin-lte/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private menubar: any = [
    {
      'title': 'Home',
      'icon': 'home',
      'link': ['']
    },
    {
      'title': 'Control',
      'icon': 'wifi',
      'link': ['/control']
    }
  ];

  constructor(
    private menuServ: MenuService,
    private msgServ: MessagesService,
    private logoServ: LogoService
  ) { }

  public ngOnInit() {
    this.menuServ.setCurrentMenu(this.menubar);
    this.logoServ.setCurrentLogo({
      small: {
        bold: 'H',
        normal: 'UST'
      },
      big: {
        bold: 'HUST',
        normal: ' IoT'
      }
    });
  }
}
