import {FoodItem} from './food-item';

export class FoodItemUtils {

  public tagstring(foodItem: FoodItem): string {
    if (!foodItem || !foodItem.tags || foodItem.tags.length === 0) return "";

    return foodItem.tags.map(tag => tag.value).filter(tag => !tag.startsWith('AGE_') && tag !== 'CNITEM').join();
  }

  public agetagstring(foodItem: FoodItem): string {
    if (!foodItem || !foodItem.tags || foodItem.tags.length === 0) return "";

    return foodItem.tags.map(tag => tag.value).filter(tag => tag.startsWith('AGE_')).join();
  }

  public category(foodItem: FoodItem): string {
    if (this.tagContainsAll(foodItem, ['MILK']))
      return 'MILK';
    else if (this.tagContainsAll(foodItem, ['VEGETABLE']))
      return 'VEGETABLE';
    else if (this.tagContainsAll(foodItem, ['FRUIT']))
      return 'FRUIT';
    else if (this.tagContainsAny(foodItem, ['MEAT', 'MEATALT']))
      return 'MEAT';
    else if (this.tagContainsAll(foodItem, ['GRAIN']))
      return 'GRAIN';
    else if (this.tagContainsAll(foodItem, ['CNITEM']))
      return 'CNITEM';
    else return 'OTHER';
  }

  public isAppropriateForAgeGroup(foodItem: FoodItem, ageGroup: string) {

    if (this.tagContainsAll(foodItem, [ageGroup]))
      return true;
    else if (this.tagContainsAll(foodItem, ['AGE_GT_6MO']))
      return ageGroup !== 'AGE_0_5MO';
    else if (this.tagContainsAny(foodItem, ['AGE_0_5MO', 'AGE_6_11MO']))
      return ageGroup === 'AGE_0_5MO' || ageGroup === 'AGE_6_11MO';
    else if (this.tagContainsAny(foodItem, ['AGE_1YR', 'AGE_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT']))
      return false;
    else return ageGroup !== 'AGE_0_5MO' && ageGroup !== 'AGE_6_11MO';
  }

  public hasTag(foodItem: FoodItem, tag: string) {
    return this.tagContainsAll(foodItem, [tag]);
  }

  public isCN(foodItem: FoodItem): boolean {
    return this.tagContainsAll(foodItem, ['CNITEM']);
  }

  public isInfant(foodItem: FoodItem): boolean {
    return this.tagContainsAny(foodItem, ['AGE_0_5MO', 'AGE_6_11MO']);
  }

  tagContainsAll(foodItem: FoodItem, items: string[]) {

    if (!foodItem || !foodItem.tags || foodItem.tags.length === 0) return false;

    const arr = foodItem.tags.map(tag => tag.value);
    for (var i = 0; i < items.length; i++) {
      if (arr.indexOf(items[i]) === -1)
        return false;
    }
    return true;
  }

  tagContainsAny(foodItem: FoodItem, items: string[]) {
    if (!foodItem || !foodItem.tags || foodItem.tags.length === 0) return false;

    const arr = foodItem.tags.map(tag => tag.value);
    return items.some(v => arr.indexOf(v) >= 0);
  }

  cnItemString(foodItem: FoodItem) {
    var str = "1 serving = ";
    if (foodItem.servingType)
      str = str + (foodItem.servingQuantity + " " + foodItem.servingType) + " ( " + (foodItem.portionSize + " oz") + " );";
    else
      str = str + (foodItem.portionSize + " oz;");

    foodItem.components.forEach(component => str = str + " " + component.portionSize + " oz " + this.tagstring(component));

    return str;
  }

}