import {FoodItemTag, compareFn as FoodItemTagCompareFn} from './food-item-tag';
import {FoodItemUtils} from './food-item-utils';

export interface FoodItem {
  id: string;
  description: string;
  shortDescription: string;
  purchaseUom: string;
  servingUom: string;
  notes: string;
  tags: FoodItemTag[];

  parent?: FoodItem;
  components?: FoodItem[];
  servingQuantity?: number;
  servingType?: string;
  portionSize?: number;
}


export function compareFn(a: FoodItem, b: FoodItem) {
  let utils = new FoodItemUtils();
  let comp = FoodItemTagCompareFn({value: utils.category(a)}, {value: utils.category(b)});
  return (comp !== 0) ? comp :
    (a.description < b.description) ? -1 :
      (a.description > b.description) ? 1 : 0; 
}