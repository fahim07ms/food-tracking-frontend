"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MealPlanForm } from "@/components/meal-plan/MealPlanForm";
import { MealPlanDisplay } from "@/components/meal-plan/MealPlanDisplay";
import { generateMealPlan, getSavedMealPlan } from "@/lib/mealPlanApi";
import { MealPlan, NutritionalGoal } from "@/lib/types/mealPlan";
import { Loader2 } from "lucide-react";

export default function MealPlanPage() {
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
    const [goal, setGoal] = useState<NutritionalGoal | undefined>();
    const [budget, setBudget] = useState<number | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // Load saved meal plan on mount
    useEffect(() => {
        const loadSavedPlan = async () => {
            try {
                const response = await getSavedMealPlan();
                setMealPlan(response.mealPlan);
                setBudget(response.mealPlan.budget);
            } catch (error: any) {
                // No saved plan exists, which is fine
                if (error?.response?.status !== 404) {
                    console.error("Failed to load saved meal plan:", error);
                }
            } finally {
                setIsInitialLoading(false);
            }
        };

        loadSavedPlan();
    }, []);

    const handleGenerateMealPlan = async (data: {
        preferences?: string;
        mealCount: number;
        budget?: number;
    }) => {
        try {
            setIsLoading(true);
            const response = await generateMealPlan(
                data.preferences,
                data.mealCount,
                data.budget
            );

            setMealPlan(response.mealPlan);
            setGoal(response.goal);
            setBudget(data.budget);

            toast.success("Meal plan generated successfully!");
        } catch (error: any) {
            console.error("Failed to generate meal plan:", error);

            // Handle specific error messages from backend
            const errorMessage = error?.response?.data?.message || "Failed to generate meal plan";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isInitialLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Meal Plan</h1>
                <p className="text-muted-foreground mt-2">
                    Generate personalized meal plans based on your inventory and nutritional goals
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <MealPlanForm onSubmit={handleGenerateMealPlan} isLoading={isLoading} />
                </div>

                <div className="lg:col-span-2">
                    <MealPlanDisplay mealPlan={mealPlan} goal={goal} budget={budget} />
                </div>
            </div>
        </div>
    );
}
