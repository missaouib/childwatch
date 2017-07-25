export interface FoodItem {
  id: string;
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
  id: string,
  description: string;
  _links?: FoodComponentLinks,
  foodItems: FoodItem[]
};


export interface Meal {
  id: string;
  description: string;
  type: string;
  foods: FoodItem[];
}

