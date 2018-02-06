import {Entity} from "./entity";
import {Tracked} from "./tracked";
export interface EntityRelationship {
  from: Entity | Tracked;
  to: Entity | Tracked;
  type: string;
}