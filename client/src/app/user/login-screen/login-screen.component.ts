import {UserService} from '../user.service';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'cw-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent implements OnInit {

  errors = false;
  logout = false;

  username: string;
  password: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private authSvc: UserService,
    private router: Router
  ) {}


  ngOnInit() {
    this.activeRoute.queryParams
      .subscribe((params: Params) => {
        this.errors = params['error'] !== undefined;
        this.logout = params['logout'] !== undefined;

        if (this.logout) this.authSvc.logout();
      });
  }

  login() {

    this.authSvc.login(this.username, this.password)
      .subscribe(
      (user) => this.router.navigate(['']),
      () => this.errors = true
      );

  }

}
