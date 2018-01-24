import {Rule} from './rule';

export interface MealRulesViolation {
  severity: string;
  message: string;
  rule: Rule;
  mealId: string;
  ageGroup?: string;
};