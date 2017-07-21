export interface FoodItem {
  description: string;
  shortDescription: string;
  foodComponent: FoodComponent;
};

export interface FoodComponentLinks{
      self: {
        href: string
      },
      foodItems: {
        href: string
      }
  }

export interface FoodComponent {
  description: string;
  _links?: FoodComponentLinks,
  foodItems?: FoodItem[]
};


export interface Meal {
  description: string;
  type: string;
  foods: FoodItem[];
}

