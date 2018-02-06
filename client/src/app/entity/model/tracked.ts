import {User} from "../../user/config.state";

export interface Tracked {
  id: string;
  updatedBy?: User | string;
  updatedDate?: Date;
}