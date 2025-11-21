"use client";

import { useEffect, useState } from "react";
import { getMonthlyAnalytics } from "@/lib/analyticsApi";
import { MonthlyAnalytics } from "@/lib/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { HeatmapGrid } from "./HeatmapGrid";
import { useAuthStore } from "@/store/authStore";

interface MonthlyHeatmapProps {
    date: Date;
}

export function MonthlyHeatmap({ date }: MonthlyHeatmapProps) {
    const [data, setData] = useState<MonthlyAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const year = date.getFullYear();
                const month = date.getMonth() + 1; // JavaScript months are 0-indexed

                const result = await getMonthlyAnalytics(year, month);
                setData(result);
                setError(null);
            } catch (err: any) {
                setError(err?.response?.data?.message || "Failed to load analytics");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [date]);

    if (isLoading) {
        return <Skeleton className="h-64 w-full" />;
    }

    if (error || !data) {
        return (
            <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                    {error || "No data available for this month"}
                </p>
            </div>
        );
    }

    // Get current goal for percentage calculation
    const currentGoalIndex = user?.current_goal_index ?? 0;
    const currentGoal = user?.goals?.[currentGoalIndex];

    // Transform data for heatmap - calculate percentages
    const heatmapData = data.dailyLogs.map((day) => {
        const nutrients = day.summary;
        const percentages = currentGoal ? {
            calcium: currentGoal.calcium ? (nutrients.calcium / currentGoal.calcium) * 100 : 0,
            calories: currentGoal.calories ? (nutrients.calories / currentGoal.calories) * 100 : 0,
            carbohydrate: currentGoal.carbohydrate ? (nutrients.carbohydrate / currentGoal.carbohydrate) * 100 : 0,
            cholesterol: currentGoal.cholesterol ? (nutrients.cholesterol / currentGoal.cholesterol) * 100 : 0,
            fat_total: currentGoal.fat_total ? (nutrients.fat_total / currentGoal.fat_total) * 100 : 0,
            fiber: currentGoal.fiber ? (nutrients.fiber / currentGoal.fiber) * 100 : 0,
            iron: currentGoal.iron ? (nutrients.iron / currentGoal.iron) * 100 : 0,
            magnesium: currentGoal.magnesium ? (nutrients.magnesium / currentGoal.magnesium) * 100 : 0,
            potassium: currentGoal.potassium ? (nutrients.potassium / currentGoal.potassium) * 100 : 0,
            protein: currentGoal.protein ? (nutrients.protein / currentGoal.protein) * 100 : 0,
            sodium: currentGoal.sodium ? (nutrients.sodium / currentGoal.sodium) * 100 : 0,
            vitamin_a: currentGoal.vitamin_a ? (nutrients.vitamin_a / currentGoal.vitamin_a) * 100 : 0,
            vitamin_c: currentGoal.vitamin_c ? (nutrients.vitamin_c / currentGoal.vitamin_c) * 100 : 0,
            vitamin_d: currentGoal.vitamin_d ? (nutrients.vitamin_d / currentGoal.vitamin_d) * 100 : 0,
        } : {
            calcium: 0,
            calories: 0,
            carbohydrate: 0,
            cholesterol: 0,
            fat_total: 0,
            fiber: 0,
            iron: 0,
            magnesium: 0,
            potassium: 0,
            protein: 0,
            sodium: 0,
            vitamin_a: 0,
            vitamin_c: 0,
            vitamin_d: 0,
        };

        return {
            label: day.date.split('-')[2], // Just the day number
            nutrients: percentages,
        };
    });

    return <HeatmapGrid data={heatmapData} />;
}
