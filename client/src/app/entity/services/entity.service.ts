import {Entity} from "../model/entity";
import {Gender} from "../model/gender";
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";

@Injectable()
export class EntityService {

  Entities: Entity[] = [
    {
      id: '1',
      firstName: 'Bradley',
      lastName: 'Young',
      birthdate: new Date('4/1/2014'),
      enrollmentDate: new Date('1/1/2018'),
      gender: Gender.MALE,
      address: {
        id: '2'
      },
      related: [
        {
          from: {id: '2', firstName: 'Matthew', lastName: 'Young', gender: Gender.MALE},
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
