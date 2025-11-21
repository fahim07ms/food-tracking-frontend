import api from "./api";
import { GenerateMealPlanResponse, GetSavedMealPlanResponse } from "./types/mealPlan";
import { generateMealPlanSchema } from "./schemas";

const MEAL_PLAN_BASE_URL = "/user";

/**
 * Generate AI meal plan based on inventory and goals
 */
export const generateMealPlan = async (
    preferences?: string,
    mealCount?: number,
    budget?: number
): Promise<GenerateMealPlanResponse> => {
    const validatedData = generateMealPlanSchema.parse({
        preferences,
        mealCount,
        budget,
    });

    const response = await api.post<GenerateMealPlanResponse>(
        `${MEAL_PLAN_BASE_URL}/generate-meal-plan`,
        validatedData
    );
    return response.data;
};

/**
 * Get saved AI meal plan
 */
export const getSavedMealPlan = async (): Promise<GetSavedMealPlanResponse> => {
    const response = await api.get<GetSavedMealPlanResponse>(
        `${MEAL_PLAN_BASE_URL}/saved-meal-plan`
    );
    return response.data;
};
