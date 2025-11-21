"use client";

import { useEffect, useState } from "react";
import { getSingleDayAnalytics } from "@/lib/analyticsApi";
import { SingleDayAnalytics } from "@/lib/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { HeatmapGrid } from "./HeatmapGrid";

interface SingleDayHeatmapProps {
    date: Date;
}

export function SingleDayHeatmap({ date }: SingleDayHeatmapProps) {
    const [data, setData] = useState<SingleDayAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const dateStr = date.toISOString().split('T')[0];
                const result = await getSingleDayAnalytics(dateStr);
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
                    {error || "No data available for this date"}
                </p>
            </div>
        );
    }

    // Transform data for heatmap
    const heatmapData = [
        {
            label: date.toISOString().split('T')[0],
            nutrients: data.result_percentage,
        },
    ];

    return <HeatmapGrid data={heatmapData} />;
}
