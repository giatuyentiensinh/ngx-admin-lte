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
    },
    {
      'title': 'Sensor',
      'icon': 'stethoscope',
      'link': ['/sensor']
    }
  ];

  constructor(
    private menuServ: MenuService,
    private msgServ: MessagesService,
    private logoServ: LogoService
  ) { }

  public ngOnInit() {
    this.menuServ.setCurrentMenu(this.menubar);

    const user1 = new User({
      avatarUrl: 'public/assets/img/user1-128x128.jpg',
      email: 'tuyenng299@gmail.com',
      firstname: 'Tuyen',
      lastname: 'Nguyen Gia'
    });
    const user2 = new User({
      avatarUrl: 'public/assets/img/user2-160x160.jpg',
      email: 'EMAIL',
      firstname: 'FIRSTNAME',
      lastname: 'LASTNAME'
    });
    // sending a test message
    this.msgServ.addMessage(new Message({
      author: user1,
      content: 'Content',
      destination: user2,
      title: 'Title'
    }));
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
