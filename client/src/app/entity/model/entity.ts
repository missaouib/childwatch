import {Address} from "./address";
import {EntityRelationship} from "./entity-relationship";
import {Tracked} from "./tracked";

export interface Entity extends Tracked {
  firstName: string;
  lastName: string;
  birthdate?: Date;
  enrollmentDate?: Date;
  address?: Address;
  related?: EntityRelationship[];
  gender: string;
};