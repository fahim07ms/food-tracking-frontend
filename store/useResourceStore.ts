import { create } from 'zustand';
import { Resource } from '@/types';

interface ResourceState {
    resources: Resource[];
}

const seededResources: Resource[] = [
    { id: '1', title: 'How to Store Apples', description: 'Keep apples in the crisper drawer of your fridge to keep them fresh for weeks.', category: 'Fruit', type: 'Tip' },
    { id: '2', title: 'Freezing Milk', description: 'You can freeze milk for up to 3 months. Thaw in the fridge before use.', category: 'Dairy', type: 'Tip' },
    { id: '3', title: 'Revive Wilted Greens', description: 'Soak wilted spinach or lettuce in ice water for 15-30 minutes to crisp them up.', category: 'Vegetable', type: 'Tip' },
    { id: '4', title: 'Understanding Expiration Dates', description: 'Learn the difference between "Sell By", "Use By", and "Best By" dates.', category: 'General', type: 'Article' },
    { id: '5', title: 'Composting 101', description: 'A beginner guide to composting food scraps at home.', category: 'Waste Reduction', type: 'Article' },
    { id: '6', title: 'Meal Planning on a Budget', description: 'Tips for planning meals to save money and reduce waste.', category: 'Budget', type: 'Article' },
    { id: '7', title: 'Creative Uses for Stale Bread', description: 'Turn stale bread into croutons, breadcrumbs, or french toast.', category: 'Grain', type: 'Tip' },
    { id: '8', title: 'Storing Eggs Correctly', description: 'Store eggs in their original carton on a shelf, not the door, for consistent temperature.', category: 'Protein', type: 'Tip' },
    { id: '9', title: 'Regrowing Green Onions', description: 'Place green onion roots in water to regrow them indefinitely.', category: 'Vegetable', type: 'Tip' },
    { id: '10', title: 'Freezing Cheese', description: 'Hard cheeses freeze well. Grate them before freezing for easy use.', category: 'Dairy', type: 'Tip' },
    { id: '11', title: 'Banana Bread Recipe', description: 'The perfect use for overripe bananas.', category: 'Fruit', type: 'Tip' },
    { id: '12', title: 'First In, First Out', description: 'Organize your pantry so older items are at the front.', category: 'Organization', type: 'Tip' },
    { id: '13', title: 'Vegetable Stock from Scraps', description: 'Save veggie peels and ends to make a delicious homemade stock.', category: 'Waste Reduction', type: 'Tip' },
    { id: '14', title: 'Preserving Herbs', description: 'Freeze herbs in olive oil or dry them to make them last longer.', category: 'Vegetable', type: 'Tip' },
    { id: '15', title: 'Shopping with a List', description: 'Stick to your list to avoid impulse buys and food waste.', category: 'Budget', type: 'Tip' },
];

export const useResourceStore = create<ResourceState>()((set) => ({
    resources: seededResources,
}));
