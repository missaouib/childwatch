import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cw-child-detail',
  templateUrl: './child-detail.component.html',
  styleUrls: ['./child-detail.component.css']
})
export class ChildDetailComponent implements OnInit {

  connections: any[] = [
    { name: 'Kathy Green', image: 'face-0.jpg', role: 'Mother', contact: '(000) 555-1212' },
    { name: 'Kevin Green', image: 'face-0.jpg', role: 'Father', contact: '(000) 555-2222' },
    { name: 'Mary Popins', image: 'face-0.jpg', role: 'Nanny', contact: '(000) 555-2111' }
  ];
  
  constructor() { }

  ngOnInit() {
  }

}
