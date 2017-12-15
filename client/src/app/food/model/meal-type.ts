export class MealType {
  public ALL = ['BREAKFAST', 'AM_SNACK', 'LUNCH', 'PM_SNACK', 'SUPPER', 'EV_SNACK'];
  public toDisplay(type: string): string {
    switch (type) {
      case 'BREAKFAST': return 'Breakfast';
      case 'AM_SNACK': return 'AM Snack';
      case 'LUNCH': return 'Lunch';
      case 'PM_SNACK': return 'PM Snack';
      case 'SUPPER': return 'Supper';
      case 'EV_SNACK': return 'Evening Snack';
      default: return undefined;
    }
  }

}