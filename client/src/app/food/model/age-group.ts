export class AgeGroup {
  static ALL = ['AGE_0_5MO', 'AGE_6_11MO', 'AGE_1YR', 'AGE_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT'];
  static toDisplay(ageGroup): string {
    return ageGroup.substring(4).replace("_", "-").replace('MO', ' MO').replace('YR', ' YR');
  }
}