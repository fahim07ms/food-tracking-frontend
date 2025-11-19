export type User = {
    id: string;
    name: string;
    email: string;
    householdSize: number;
    dietaryPreferences: string[];
    location?: string;
};

export type FoodItem = {
    id: string;
    name: string;
    category: 'Fruit' | 'Vegetable' | 'Dairy' | 'Grain' | 'Protein' | 'Other';
    quantity: number;
    unit: string;
    expirationDate: string; // ISO date
    costPerUnit: number;
};

export type ConsumptionLog = {
    id: string;
    itemId: string; // Reference to FoodItem (optional if manual entry)
    itemName: string;
    quantity: number;
    date: string;
    category: string;
};

export type Resource = {
    id: string;
    title: string;
    description: string;
    category: string;
    type: 'Article' | 'Video' | 'Tip';
    url?: string;
};
