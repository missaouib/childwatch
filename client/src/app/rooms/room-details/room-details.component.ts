import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cw-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})
export class RoomDetailsComponent implements OnInit {

  children: any[] = [
    { name: 'Green, Kim', image: 'baby1.jpg', note: 'Till 5:00 PM' },
    { name: 'Red, Joe', image: 'baby5.jpg', note: 'Till 12:45 PM' },
    { name: 'Blue, Karen', image: 'face-0.jpg', note: 'Till 12:45 PM' },
    { name: 'Indigo, Phil', image: 'face-0.jpg', note: 'Till 12:45 PM' },        
    { name: 'Orange, Tommy', image: 'baby6.jpg', note: 'Till 12:45 PM' },
    { name: 'Yellow, Jill', image: 'baby7.jpg', note: 'Till 5:00 PM' },
    { name: 'Violet, Christine', image: 'face-0.jpg', note: 'Till 12:45 PM' },
    { name: 'Pink, Kara', image: 'face-0.jpg', note: 'Till 12:45 PM' },
    { name: 'White, Chad', image: 'face-0.jpg', note: 'Till 4:30 PM' },
    { name: 'Black, Tammy', image: 'face-0.jpg', note: 'Till 4:30 PM' },
  ];
  
  staffs: any[] = [
    { name: 'Marzek, Margie', image: 'face-0.jpg', note: 'Till 5:00 PM' }
  ];
  
  room = {
    name:  'Butterfly',
    site:  'North Valley',
    image: 'room/butterfly.svg',
    issue: 'Understaffed'
  };
  
  
  constructor() { }

  ngOnInit() {
  }

}
