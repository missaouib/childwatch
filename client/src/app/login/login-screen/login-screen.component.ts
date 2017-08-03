import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'cw-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent implements OnInit {

    errors = false;
  
  constructor( private activeRoute: ActivatedRoute ) { }


  ngOnInit() {
      this.activeRoute.queryParams.subscribe( ( params: Params ) =>  this.errors = params['error'] !== undefined );
  }

}
