// Nutrient result interface
export interface NutrientResult {
    calcium: number;
    calories: number;
    carbohydrate: number;
    cholesterol: number;
    fat_total: number;
    fiber: number;
    iron: number;
    magnesium: number;
    potassium: number;
    protein: number;
    sodium: number;
    vitamin_a: number;
    vitamin_c: number;
    vitamin_d: number;
}

// Single day analytics
export interface SingleDayAnalytics {
    message: string;
    date: string;
    result_percentage: NutrientResult;
}

// Daily summary for weekly/monthly analytics
export interface DailySummary {
    date: string;
    dayOfWeek?: string;
    logs?: any[];
    summary: NutrientResult;
    result_percentage?: NutrientResult;
}

// Weekly analytics
export interface WeeklyAnalytics {
    message: string;
    startDate: string;
    endDate: string;
    dailyLogs: DailySummary[];
    weeklyTotals: NutrientResult;
    weeklyAverages: NutrientResult;
    weeklyAveragePercentages?: NutrientResult;
    currentGoal?: any;
    aiSuggestions?: string | null;
}

// Monthly analytics
export interface MonthlyAnalytics {
    message: string;
    year: number;
    month: number;
    dailyLogs: DailySummary[];
}

// SDG Impact Report
export interface SdgImpactReport {
    message: string;
    score: number;
    components: {
        nutritionScore: number;
        wasteScore: number;
    };
    period: {
        startDate: string;
        endDate: string;
    };
    weeklySummary: {
        weeklyAverages: NutrientResult;
        weeklyAveragePercentages: NutrientResult;
    };
    inventorySummary: {
        totalItems: number;
        warningCount: number;
        wastedCount: number;
        healthyCount: number;
    };
    strengths: string[];
    improvements: string[];
    actionPlan: string;
}

// Inventory expiration
export interface ExpirationItem {
    foodItem: {
        _id: string;
        name: string;
        image_url?: string;
        expiration_hours: number;
    };
    createdAt: Date;
    hoursElapsed: number;
    hoursRemaining: number;
    percentageRemaining: number;
    status: "warning" | "wasted";
}

export interface InventoryExpirationCheck {
    message: string;
    inventoryCreatedAt: Date;
    totalItems: number;
    warning: ExpirationItem[];
    wasted: ExpirationItem[];
    summary: {
        warningCount: number;
        wastedCount: number;
        healthyCount: number;
    };
}

// Resource recommendation
export interface Resource {
    _id: string;
    title: string;
    content: string;
    type: "article" | "video";
    tags: string[];
    video_url?: string;
    created_by?: {
        _id: string;
        fullName: string;
        email: string;
        image_url?: string;
    };
    createdAt: string;
    updatedAt?: string;
}

export interface ResourceRecommendations {
    message: string;
    recommendations: Resource[];
}
