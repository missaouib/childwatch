import {ClientService} from './client.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  Clients: any;

  constructor(
    private clientSvc: ClientService
  ) {}

  ngOnInit(): void {
    this.clientSvc.query().subscribe(clients => this.Clients = clients);
  }
}
