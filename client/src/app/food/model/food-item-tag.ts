import {FoodItemUtils} from "./food-item-utils";

export interface FoodItemTag {
  value: string;
}

export function compareFn(a: FoodItemTag, b: FoodItemTag) {
  let utils = new FoodItemUtils();
  let aIdx = a ? utils.tagOrder().indexOf(a.value) : -1;
  let bIdx = b ? utils.tagOrder().indexOf(b.value) : -1;
  return aIdx > bIdx ? 1 : aIdx < bIdx ? -1 : 0;
}
