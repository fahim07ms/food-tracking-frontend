import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FoodItem } from '@/types';

interface InventoryState {
    items: FoodItem[];
    addItem: (item: FoodItem) => void;
    updateItem: (id: string, item: Partial<FoodItem>) => void;
    removeItem: (id: string) => void;
}

const seededItems: FoodItem[] = [
    { id: '1', name: 'Apples', category: 'Fruit', quantity: 5, unit: 'pcs', expirationDate: '2023-12-01', costPerUnit: 0.5 },
    { id: '2', name: 'Milk', category: 'Dairy', quantity: 1, unit: 'liter', expirationDate: '2023-11-25', costPerUnit: 1.2 },
    { id: '3', name: 'Rice', category: 'Grain', quantity: 2, unit: 'kg', expirationDate: '2024-06-01', costPerUnit: 2.0 },
    { id: '4', name: 'Eggs', category: 'Protein', quantity: 12, unit: 'pcs', expirationDate: '2023-11-30', costPerUnit: 0.3 },
    { id: '5', name: 'Spinach', category: 'Vegetable', quantity: 1, unit: 'bunch', expirationDate: '2023-11-22', costPerUnit: 1.5 },
    { id: '6', name: 'Chicken Breast', category: 'Protein', quantity: 500, unit: 'g', expirationDate: '2023-11-23', costPerUnit: 5.0 },
    { id: '7', name: 'Yogurt', category: 'Dairy', quantity: 4, unit: 'cups', expirationDate: '2023-12-05', costPerUnit: 0.8 },
    { id: '8', name: 'Bread', category: 'Grain', quantity: 1, unit: 'loaf', expirationDate: '2023-11-24', costPerUnit: 2.5 },
    { id: '9', name: 'Bananas', category: 'Fruit', quantity: 6, unit: 'pcs', expirationDate: '2023-11-26', costPerUnit: 0.4 },
    { id: '10', name: 'Cheese', category: 'Dairy', quantity: 200, unit: 'g', expirationDate: '2023-12-15', costPerUnit: 3.0 },
    { id: '11', name: 'Carrots', category: 'Vegetable', quantity: 1, unit: 'kg', expirationDate: '2023-12-10', costPerUnit: 1.0 },
    { id: '12', name: 'Pasta', category: 'Grain', quantity: 500, unit: 'g', expirationDate: '2024-12-01', costPerUnit: 1.5 },
    { id: '13', name: 'Tomatoes', category: 'Vegetable', quantity: 5, unit: 'pcs', expirationDate: '2023-11-28', costPerUnit: 0.6 },
    { id: '14', name: 'Orange Juice', category: 'Fruit', quantity: 1, unit: 'liter', expirationDate: '2023-12-01', costPerUnit: 2.0 },
    { id: '15', name: 'Salmon', category: 'Protein', quantity: 300, unit: 'g', expirationDate: '2023-11-21', costPerUnit: 8.0 },
];

export const useInventoryStore = create<InventoryState>()(
    persist(
        (set) => ({
            items: seededItems,
            addItem: (item) => set((state) => ({ items: [...state.items, item] })),
            updateItem: (id, updates) =>
                set((state) => ({
                    items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
                })),
            removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
        }),
        {
            name: 'food-tracking-inventory',
        }
    )
);
