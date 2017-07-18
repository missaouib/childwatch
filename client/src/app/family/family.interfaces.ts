/**
 * Entities can be:
 * a participant
 * an adult
 * a family as a whole
 * an business or organization
 * a school
 * a program
 *
 * Entities are used to capture data about a generic
 * "thing" that the participant can be associated with.
 *
 * As it relates to this feature (family data), the fact that an NPP can also be
 * staff is irrelevant
 */

/**
 * Family
 * 
 * Members of a family are decided explicitly by the user.
 * When a participant is added and a family is not specified at the time
 * of creation; a new family is automatically generated and associated with
 * the individual. The user can go back and modify the family information
 * as needed.
 * 
 * The individuals of a family can be found by tracing all of the relationships
 * that are formed between participants and adults to the same family entity.
 */

/**
 * Participant
 * 
 * THE representation of participants in the system
 * This definition represents the primary record of a participant
 * TODO: include information such as allergies, address, notes, etc...
 */

/**
 * NPP (Non-participant person, often referred to as Adult)
 * 
 * These entities are tracked so users can associate participants with the
 * various individuals outside of the care center that have some form of
 * relationship (positive or negative) with a participant
 */

export enum EntityType {
  Participant,
  NPP,
  Family,
  Other
}

export interface Entity {
  id: string;
  displayName: string;
  entityType: EntityType;
};

/**
 * Some relationships will have negative associations. An extreme example,
 * a restraining order. The particular details of a relationship can be noted
 * added as a note on the relationship itself, the affinity can be used to
 * easily visualize the nature of the relationship in icon form
 */
export enum Affinity {
  Danger,
  Caution,
  Neutral,
  Positive
}

/**
 * Entities can be linked together in various combinations of M-M
 * relationship combinations. Some of these relationships will be
 * defined by the system. Others will be specified by the users.
 */
export interface RelationshipType {
  id: string;
  name: string;
  custom: boolean;
  affinity: Affinity;
  bidirectional: boolean;
}

/**
 * The representation of the actual link between entities
 * 
 * to and from are references to the entity ids being linked
 * 
 * Notes can be used to capture any unusual details about the relationship being formed
 * For example: Uncle Bob may be able to drop off participant x, but is not allowed to
 * pick up.
 * 
 * When a participant is involved, directionality is participant centric. Examples:
 * 
 * from participant -> to adult (participant has a parent)
 * from participant -> to other (participant is billed to non-person entity)
 * 
 */
export interface Relationship {
  to: string;
  from: string;
  relationshipType: RelationshipType;
  notes?: string;
};

// TODO do we really want these to have common superclass, or is it only useful
// for the graph and should only be projected and used there?
export interface Family extends Entity {
  name: string;
}

export interface Participant extends Entity {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: number;
}

export interface FamilyRelationship {
  participantId: string;
  familyId: string;
}

export interface NonParticipant extends Entity {
  id: string;
  firstName: string;
  lastName: string;
}

export type PickupAuthorization = 'AUTHORIZED' | 'NOT_AUTHORIZED' | 'ALERT';

export interface NonParticipantRelationship {
  participantId: string;
  nonParticipantId: string;
  dropoffAuthorization: boolean;
  pickupAuthorization: PickupAuthorization;
  paymentResponsibility: boolean;
  parent: boolean;
  notes: string;
}
