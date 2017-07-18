import { Action } from '@ngrx/store';

import {
  Entity,
  Family,
  Participant,
  NonParticipant,
  FamilyRelationship,
  NonParticipantRelationship
} from './family.interfaces';
export interface FamilyState {
  // TODO: final version may not prefetch all entities
  families: Family[];
  participants: Participant[];
  nonParticipants: NonParticipant[];
  familyRelationships: FamilyRelationship[];
  nonParticipantRelationships: NonParticipantRelationship[];
  // id of the currently selected entity
  selectedEntity: string;
  // list of entities IDs for which the user
  // is viewing details
  entityDetailList: string[];
  // when viewing family details, membersSelected
  // contains the list of IDs of family members selected for previewing
  membersSelected: string[];
}

const initialFamilyState: FamilyState = {
  families: [],
  participants: [],
  nonParticipants: [],
  familyRelationships: [],
  nonParticipantRelationships: [],
  selectedEntity: undefined,
  entityDetailList: [],
  membersSelected: []
};

const DATA_ARRIVED = 'DATA_ARRIVED';
export function dataArrived(payload: {
  families: Family[],
  participants: Participant[],
  nonParticipants: NonParticipant[],
  familyRelationships: FamilyRelationship[],
  nonParticipantRelationships: NonParticipantRelationship[]
}): Action {
  return {
    type: DATA_ARRIVED,
    payload
  };
}

const ENTITY_SELECTED = 'ENTITY_SELECTED';
export function entitySelected(payload: Entity) {
  return { type: ENTITY_SELECTED, payload };
}

const MEMBERS_SELECTED = 'MEMBERS_SELECTED';
export function membersSelected(members: Entity[]) {
  // Don't store objects to existing things, just IDs
  const payload: string[] = [];
  members.forEach(member => payload.push(member.id));
  return { type: MEMBERS_SELECTED, payload };
}

export function familyReducer(state: FamilyState = initialFamilyState, action: Action): FamilyState {
  switch (action.type) {
    case DATA_ARRIVED:
      const { families, participants, nonParticipants, familyRelationships, nonParticipantRelationships } = action.payload;
      return { ...state, families, participants, nonParticipants, familyRelationships, nonParticipantRelationships };
    case ENTITY_SELECTED:
      return { ...state, selectedEntity: action.payload.id, membersSelected: [] };
    case MEMBERS_SELECTED:
      return { ...state, membersSelected: action.payload };
    default:
      return state;
  }
}

