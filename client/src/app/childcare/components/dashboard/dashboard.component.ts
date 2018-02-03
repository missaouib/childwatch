import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'cw-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
  
  
export class DashboardComponent implements OnInit {

  roomFilterForm: FormGroup;   
  
   Rooms: any[] = [ 
  {
      name: 'Butterfly',
      site: 'North Valley',
      img: 'butterfly.svg',
      childrenCount: 10,
      staffCount: 1,
      isUnderstaffed: true,
      isOverstaffed: false
  },
      {
      name: 'Dragonfly',
      site: 'North Valley',
      img: 'dragonfly.svg',
      childrenCount: 10,
      staffCount: 2,
      isUnderstaffed: false,
      isOverstaffed: false
  },
      {
      name: 'Owl',
      site: 'East',
      img: 'owl.svg',
      childrenCount: 11,
      staffCount: 2,
      isUnderstaffed: false,
      isOverstaffed: false
  },
      {
      name: 'Hummingbird',
      site: 'East',
      img: 'hummingbird.svg',
      childrenCount: 14,
      staffCount: 3,
      isUnderstaffed: false,
      isOverstaffed: false
  },
      {
      name: 'Squirrel',
      site: 'East',
      img: 'squirrel.svg',
      childrenCount: 7,
      staffCount: 1,
      isUnderstaffed: false,
      isOverstaffed: false
  },      
      {
      name: 'Ladybug',
      site: 'Downtown',
      img: 'ladybug.svg',
      childrenCount: 12,
      staffCount: 2,
      isUnderstaffed: false,
      isOverstaffed: false
  },
      {
      name: 'Bumblebee',
      site: 'Downtown',
      img: 'bee.svg',
      childrenCount: 7,
      staffCount: 3,
      isUnderstaffed: false,
      isOverstaffed: true
  }    
    
  ];
  
  RoomList: any[] = this.Rooms;
  
  constructor( 
    private router: Router,
    private fb: FormBuilder  
  ) { }

 
  
  ngOnInit() {
    this.roomFilterForm = this.fb.group( {
      roomFilter: ['All']
    });
    
    this.roomFilterForm.valueChanges.subscribe( () => { 
      this.RoomList = ( this.roomFilterForm.value.roomFilter === 'All' ) ? 
        this.Rooms : this.Rooms.filter( (room) => room.site === this.roomFilterForm.value.roomFilter );
    });
  }
  
  goToRoomDetails() {
    this.router.navigate(['./room']); 
  }

}
