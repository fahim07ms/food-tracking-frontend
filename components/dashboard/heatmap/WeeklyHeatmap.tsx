"use client";

import { useEffect, useState } from "react";
import { getWeeklyAnalytics } from "@/lib/analyticsApi";
import { WeeklyAnalytics } from "@/lib/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { HeatmapGrid } from "./HeatmapGrid";

interface WeeklyHeatmapProps {
    startDate: Date;
}

export function WeeklyHeatmap({ startDate }: WeeklyHeatmapProps) {
    const [data, setData] = useState<WeeklyAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Calculate start of week (Sunday)
                const dayOfWeek = startDate.getDay();
                const weekStart = new Date(startDate);
                weekStart.setDate(startDate.getDate() - dayOfWeek);

                const dateStr = weekStart.toISOString().split('T')[0];
                const result = await getWeeklyAnalytics(dateStr);
                setData(result);
                setError(null);
            } catch (err: any) {
                setError(err?.response?.data?.message || "Failed to load analytics");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [startDate]);

    if (isLoading) {
        return <Skeleton className="h-64 w-full" />;
    }

    if (error || !data) {
        return (
            <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                    {error || "No data available for this week"}
                </p>
            </div>
        );
    }

    // Transform data for heatmap
    const heatmapData = data.dailyLogs.map((day) => ({
        label: `${day.dayOfWeek?.substring(0, 3)} ${day.date.split('-')[2]}`,
        nutrients: day.result_percentage || {
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
        },
    }));

    return <HeatmapGrid data={heatmapData} />;
}
