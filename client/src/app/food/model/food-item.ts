export class FoodItem {

  id: string;
  description: string;
  shortDescription: string;
  purchaseUom: string;
  servingUom: string;
  notes: string;
  tags: {value: string}[];


  FoodItem() {}


  public get tagstring(): string {
    return this.tags.map(tag => tag.value).filter(tag => !tag.startsWith('AGE_')).join();
  }

  public get category(): string {
    if (this.tagContainsAll(['MILK']))
      return 'MILK';
    else if (this.tagContainsAll(['VEGIE']))
      return 'VEGETABLE';
    else if (this.tagContainsAll(['FRUIT']))
      return 'FRUIT';
    else if (this.tagContainsAny(['MEAT', 'MEATALT']))
      return 'MEAT';
    else if (this.tagContainsAll(['GRAIN']))
      return 'GRAIN';
    else return 'OTHER';
  }

  public isAppropriateForAgeGroup(ageGroup: string) {

    if (this.tagContainsAll([ageGroup]))
      return true;
    else if (this.tagContainsAll(['AGE_GT_6MO']))
      return ageGroup !== 'AGE_0_5MO';
    else if (this.tagContainsAny(['AGE_0_5MO', 'AGE_6_11MO']))
      return ageGroup === 'AGE_0_5MO' || ageGroup === 'AGE_6_11MO';
    else if (this.tagContainsAny(['AGE_1_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT']))
      return false;
    else return ageGroup !== 'AGE_0_5MO' && ageGroup !== 'AGE_6_11MO';
  }

  public hasTag(tag: string) {
    return this.tagContainsAll([tag]);
  }

  public isCN(): boolean {
    return this.tagContainsAll(['CNITEM']);
  }

  public isInfant(): boolean {
    return this.tagContainsAny(['AGE_0_5MO', 'AGE_6_11MO']);
  }

  tagContainsAll(items: string[]) {
    const arr = this.tags.map(tag => tag.value);
    for (var i = 0; i < items.length; i++) {
      if (arr.indexOf(items[i]) === -1)
        return false;
    }
    return true;
  }

  tagContainsAny(items: string[]) {
    const arr = this.tags.map(tag => tag.value);
    return items.some(v => arr.indexOf(v) >= 0);
  }

}