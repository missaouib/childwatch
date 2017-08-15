//import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
//import { Effect } from '@ngrx/effects';
import * as _ from 'lodash';
//import gql from 'graphql-tag';

import { entitySelected, membersSelected, /*dataArrived*/ } from './family.state';
import {
  Entity, EntityType, Family, Participant,
  FamilyRelationship, NonParticipant, NonParticipantRelationship
} from './family.interfaces';
import { AppState } from '../app.state';
// import { dateTimestamp } from '../../common/date-utils';

/*
const query = gql`
  query familydata {
    families {
      id
      name
    }
    
    participants {
      id
      firstName
      lastName
      dateOfBirth
      families {
        id
      }
      nonParticipantRelationships {
        nonParticipant {
          id
        }
        dropoffAuthorization
        pickupAuthorization
        paymentResponsibility
        parent
        notes
      }
    }
    
    nonParticipants {
      id
      firstName
      lastName
    }
  }
`;
 */

// TODO: test families/family/id path, then switch to using top-level query on just
// relationships?

@Injectable()
export class FamilyInfoService {
  /*
  @Effect()
  _loadData = this.loadData()
    .map(({ families, participants, familyRelationships, nonParticipants, nonParticipantRelationships }) =>
      dataArrived(<any>{ families, participants, nonParticipants, familyRelationships, nonParticipantRelationships }));
  */
  families: Observable<Family[]>;
  participants: Observable<Participant[]>;
  nonParticipants: Observable<NonParticipant[]>;
  // other: Observable<Entity[]>;
  familyRelationships: Observable<FamilyRelationship[]>;
  nonParticipantRelationships: Observable<NonParticipantRelationship[]>;
  allEntities: Observable<Entity[]>;
  selectedEntity: Observable<Entity>;
  selectedFamilyMembers: Observable<Entity[]>;
  previewMembers: Observable<Entity[]>;

  constructor(
    private store: Store<AppState>,
    //private apollo: Apollo
  ) {

    this.families = this.store.select(s => s.family.families);
    this.participants = this.store.select(s => s.family.participants);
    this.nonParticipants = this.store.select(s => s.family.nonParticipants);
    this.familyRelationships = this.store.select(s => s.family.familyRelationships);
    this.nonParticipantRelationships = this.store.select(s => s.family.nonParticipantRelationships);
    this.allEntities = Observable.combineLatest(
      this.families,
      this.participants,
      this.nonParticipants,
      (families, participants, nonParticipants) => [].concat(families, participants, nonParticipants));
    this.selectedEntity = store.select(s => s.family.selectedEntity)
      .withLatestFrom(this.allEntities)
      .map((values: [string, Entity[]]) => {
        const entities = values[1];
        return entities.find(entity => entity.id === values[0]);
      });

    this.selectedFamilyMembers = this.selectedEntity
      .switchMap(family => {
        if (family && family.entityType === EntityType.Family) {
          return this.familyMembersFor(family.id);
        } else {
          return Observable.of([]);
        }
      });

    this.previewMembers = Observable.combineLatest(
      this.participants,
      store.select(s => s.family.membersSelected),
      (participants, membersSelected) => participants.filter(p => membersSelected.indexOf(p.id) >= 0));
  }

/*  private loadData(): Observable<{
    families: Family[],
    participants: Participant[],
    familyRelationships: FamilyRelationship[],
    nonParticipants: NonParticipant[],
    nonParticipantRelationships: NonParticipantRelationship[]
  }> {
    return this.apollo.watchQuery({ query })
      .map(({ data: { families, participants, nonParticipants } }: any) => {
        const _families = families.map((f: any) => ({
          id: f.id,
          name: f.name,
          displayName: f.name,
          entityType: EntityType.Family
        }));
        const _participants: Participant[] = participants.map((p: any) => ({
          id: p.id,
          firstName: p.firstName,
          lastName: p.lastName,
          dateOfBirth: dateTimestamp(p.dateOfBirth),
          displayName: p.firstName + ' ' + p.lastName,
          entityType: EntityType.Participant
        }));
        const _nonParticipants = nonParticipants.map((p: any) => ({
          id: p.id,
          firstName: p.firstName,
          lastName: p.lastName,
          displayName: p.firstName + ' ' + p.lastName,
          entityType: EntityType.NPP
        }));
        const _familyRelationships = _.flatMap(participants, p =>
          p.families.map((family: any) => ({
            participantId: p.id,
            familyId: family.id
          })));
        const _nonParticipantRelationships = _.flatMap(participants, p =>
          p.nonParticipantRelationships.map((npr: any) => ({
            participantId: p.id,
            nonParticipantId: npr.nonParticipant.id,
            dropoffAuthorization: npr.dropoffAuthorization,
            pickupAuthorization: npr.pickupAuthorization,
            paymentResponsibility: npr.paymentResponsibility,
            parent: npr.parent,
            notes: npr.notes
          })));

        return {
          families: _families,
          participants: _participants,
          familyRelationships: _familyRelationships,
          nonParticipants: _nonParticipants,
          nonParticipantRelationships: _nonParticipantRelationships
        };
      });
  }*/

  selectEntity(entity: Entity) {
    this.store.dispatch(entitySelected(entity));
  }

  // On the family details panel a user can select multiple members to compare
  // and view. This sets the members in the store
  viewingMembers(members: Participant[]) {
    this.store.dispatch(membersSelected(members));
  }

  private familyMembersFor(familyId: string): Observable<Participant[]> {
    return Observable.combineLatest(
      this.familyRelationships,
      this.participants,
      (relationships, participants) =>
        relationships
          .filter(r => r.familyId === familyId)
          .map(r => _.find(participants, { id: r.participantId }))
          .filter(_.identity)
    );
  }
}
