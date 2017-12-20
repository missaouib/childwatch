export class AgeGroup {
  static ALL = ['AGE_0_5MO', 'AGE_6_11MO', 'AGE_1YR', 'AGE_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT'];
  static ALL_NONPAR = ['AGE_0_5MO', 'AGE_6_11MO', 'AGE_1YR', 'AGE_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT', 'NON_PARTICIPANT'];
  static toDisplay(ageGroup): string {
    return ageGroup.substring(4).replace("_", "-").replace('MO', ' MO').replace('YR', ' YR');
  }

  get _ALL(): string[] {
    return AgeGroup.ALL;
  }

  get _ALL_NONPAR(): string[] {
    return AgeGroup.ALL_NONPAR;
  }

  _toDisplay(ageGroup): string {
    return AgeGroup.toDisplay(ageGroup);
  }
}