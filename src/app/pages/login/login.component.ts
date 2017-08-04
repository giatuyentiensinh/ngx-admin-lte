import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, UserService } from '../../ngx-admin-lte/index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  styles: ['../../ngx-admin-lte/layouts/login/login.css'],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  private password: string;
  private email: string;

  constructor(
    private userServ: UserService,
    private router: Router
  ) { }

  public ngOnInit() {
    window.dispatchEvent(new Event('resize'));
  }

  private login() {
    if (1 === 1) {
      const user1 = new User({
        avatarUrl: 'public/assets/img/user1-128x128.jpg',
        email: 'tuyenng299@gmail.com',
        firstname: 'Tuyen',
        lastname: 'Nguyen Gia'
      });

      user1.connected = true;

      this.userServ.setCurrentUser(user1);

      this.router.navigate(['home']);
    } else {
    }
  }
}
