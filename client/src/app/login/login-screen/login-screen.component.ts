import {AuthenticationService} from '../../security/authentication.service';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'cw-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent implements OnInit {

  errors = false;

  username: string;
  password: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private authSvc: AuthenticationService,
    private router: Router
  ) {}


  ngOnInit() {
    this.activeRoute.queryParams.subscribe((params: Params) => this.errors = params['error'] !== undefined);
  }

  login() {

    this.authSvc.login(this.username, this.password)
      .subscribe(
      () => this.router.navigate(['/meals']),
      () => this.errors = true
      );

  }

}
