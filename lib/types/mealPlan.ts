export interface MealPlanItem {
    foodItemName: string;
    quantity: number;
    price: number;
    time_to_eat: string;
}

export interface MealPlan {
    items: MealPlanItem[];
    totalPrice: number;
    suggestions?: string;
}

export interface SavedMealPlan extends MealPlan {
    generatedAt: Date;
    preferences?: string;
    budget?: number;
}

export interface NutritionalGoal {
    calories: number;
    protein: number;
    carbohydrate: number;
    fat_total: number;
    fiber: number;
}

export interface GenerateMealPlanResponse {
    message: string;
    mealPlan: MealPlan;
    goal: NutritionalGoal;
    budget?: number;
    inventoryItemCount: number;
}

export interface GetSavedMealPlanResponse {
    message: string;
    mealPlan: SavedMealPlan;
}
