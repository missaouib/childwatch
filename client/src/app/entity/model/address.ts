import {Tracked} from "./tracked";

export interface Address extends Tracked {
  street1?: string;
  street2?: string;
  city?: string;
  state_prov?: string;
  postalCode?: string;
}