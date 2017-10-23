import {FoodItem} from '../food.interfaces';
export class FoodItemUtils {

  public static tagstring(foodItem: FoodItem): string {
    if (!foodItem || !foodItem.tags || foodItem.tags.length === 0) return "";

    return foodItem.tags.map(tag => tag.value).filter(tag => !tag.startsWith('AGE_') && tag !== 'CNITEM').join();
  }

  public static agetagstring(foodItem: FoodItem): string {
    if (!foodItem || !foodItem.tags || foodItem.tags.length === 0) return "";

    return foodItem.tags.map(tag => tag.value).filter(tag => tag.startsWith('AGE_')).join();
  }

  public static category(foodItem: FoodItem): string {
    if (FoodItemUtils.tagContainsAll(foodItem, ['MILK']))
      return 'MILK';
    else if (FoodItemUtils.tagContainsAll(foodItem, ['VEGETABLE']))
      return 'VEGETABLE';
    else if (FoodItemUtils.tagContainsAll(foodItem, ['FRUIT']))
      return 'FRUIT';
    else if (FoodItemUtils.tagContainsAny(foodItem, ['MEAT', 'MEATALT']))
      return 'MEAT';
    else if (FoodItemUtils.tagContainsAll(foodItem, ['GRAIN']))
      return 'GRAIN';
    else if (FoodItemUtils.tagContainsAll(foodItem, ['CNITEM']))
      return 'CNITEM';
    else return 'OTHER';
  }

  public static isAppropriateForAgeGroup(foodItem: FoodItem, ageGroup: string) {

    if (FoodItemUtils.tagContainsAll(foodItem, [ageGroup]))
      return true;
    else if (FoodItemUtils.tagContainsAll(foodItem, ['AGE_GT_6MO']))
      return ageGroup !== 'AGE_0_5MO';
    else if (FoodItemUtils.tagContainsAny(foodItem, ['AGE_0_5MO', 'AGE_6_11MO']))
      return ageGroup === 'AGE_0_5MO' || ageGroup === 'AGE_6_11MO';
    else if (FoodItemUtils.tagContainsAny(foodItem, ['AGE_1_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT']))
      return false;
    else return ageGroup !== 'AGE_0_5MO' && ageGroup !== 'AGE_6_11MO';
  }

  public static hasTag(foodItem: FoodItem, tag: string) {
    return FoodItemUtils.tagContainsAll(foodItem, [tag]);
  }

  public static isCN(foodItem: FoodItem): boolean {
    return FoodItemUtils.tagContainsAll(foodItem, ['CNITEM']);
  }

  public static isInfant(foodItem: FoodItem): boolean {
    return FoodItemUtils.tagContainsAny(foodItem, ['AGE_0_5MO', 'AGE_6_11MO']);
  }

  static tagContainsAll(foodItem: FoodItem, items: string[]) {

    if (!foodItem || !foodItem.tags || foodItem.tags.length === 0) return false;

    const arr = foodItem.tags.map(tag => tag.value);
    for (var i = 0; i < items.length; i++) {
      if (arr.indexOf(items[i]) === -1)
        return false;
    }
    return true;
  }

  static tagContainsAny(foodItem: FoodItem, items: string[]) {
    if (!foodItem || !foodItem.tags || foodItem.tags.length === 0) return false;

    const arr = foodItem.tags.map(tag => tag.value);
    return items.some(v => arr.indexOf(v) >= 0);
  }

  static cnItemString(foodItem: FoodItem) {
    var str = "1 serving = ";
    if (foodItem.servingType)
      str = str + (foodItem.servingQuantity + " " + foodItem.servingType) + " ( " + (foodItem.portionSize + " oz") + " );";
    else
      str = str + (foodItem.portionSize + " oz;");

    foodItem.components.forEach(component => str = str + " " + component.portionSize + " oz " + FoodItemUtils.tagstring(component));

    return str;
  }

}