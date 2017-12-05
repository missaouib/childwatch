import {FoodItemTag} from './food-item-tag';

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