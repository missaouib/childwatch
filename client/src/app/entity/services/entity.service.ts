import {Entity} from "../model/entity";
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";

@Injectable()
export class EntityService {

  Entities: Entity[] = [
    {
      id: '1',
      firstName: 'Bradley',
      lastName: 'Putin',
      birthdate: new Date('4/1/2014'),
      enrollmentDate: new Date('1/1/2018'),
      gender: 'MALE',
      address: {
        id: '2'
      },
      related: [
        {
          from: {id: '2', firstName: 'Vladimir', lastName: 'Putin', gender: 'MALE'},
          to: {id: '1'},
          type: 'PARENT'
        },
        {
          from: {id: '3', firstName: 'Angelina', lastName: 'Jolie', gender: 'FEMALE'},
          to: {id: '1'},
          type: 'PARENT'
        }
      ]
    }
  ];

  constructor() {}

  query(): Observable<Entity[]> {
    return Observable.of(this.Entities);
  }

  fetch(id: string): Observable<Entity> {
    return Observable.of(this.Entities.find(entity => entity.id === id));
  }
}
