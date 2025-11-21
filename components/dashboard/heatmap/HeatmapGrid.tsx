"use client";

import { NutrientResult } from "@/lib/types/analytics";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeatmapData {
    label: string;
    nutrients: NutrientResult;
}

interface HeatmapGridProps {
    data: HeatmapData[];
}

const nutrientLabels = [
    { key: "calories", label: "Calories" },
    { key: "protein", label: "Protein" },
    { key: "carbohydrate", label: "Carbs" },
    { key: "fat_total", label: "Fat" },
    { key: "fiber", label: "Fiber" },
    { key: "sodium", label: "Sodium" },
    { key: "cholesterol", label: "Cholesterol" },
    { key: "calcium", label: "Calcium" },
    { key: "iron", label: "Iron" },
    { key: "vitamin_a", label: "Vitamin A" },
    { key: "vitamin_c", label: "Vitamin C" },
    { key: "vitamin_d", label: "Vitamin D" },
];

const getColorClass = (percentage: number) => {
    if (percentage === 0) return "bg-gray-100 dark:bg-gray-800";
    if (percentage < 50) return "bg-red-500";
    if (percentage < 80) return "bg-yellow-500";
    if (percentage <= 120) return "bg-green-500";
    return "bg-blue-500";
};

const getTextColorClass = (percentage: number) => {
    if (percentage === 0) return "text-gray-400";
    return "text-white";
};

export function HeatmapGrid({ data }: HeatmapGridProps) {
    if (data.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No data available</p>
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="overflow-x-auto">
                <div className="min-w-max">
                    {/* Header Row */}
                    <div className="flex gap-1 mb-1">
                        <div className="w-24 flex-shrink-0" /> {/* Spacer for nutrient labels */}
                        {data.map((item, index) => (
                            <div
                                key={index}
                                className="w-16 text-center text-xs font-medium text-muted-foreground"
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>

                    {/* Heatmap Rows */}
                    {nutrientLabels.map((nutrient) => (
                        <div key={nutrient.key} className="flex gap-1 mb-1">
                            {/* Nutrient Label */}
                            <div className="w-24 flex-shrink-0 text-sm font-medium flex items-center">
                                {nutrient.label}
                            </div>

                            {/* Cells */}
                            {data.map((item, index) => {
                                const value = item.nutrients[nutrient.key as keyof NutrientResult];
                                const percentage = Math.round(value);

                                return (
                                    <Tooltip key={index}>
                                        <TooltipTrigger asChild>
                                            <div
                                                className={`w-16 h-12 flex items-center justify-center rounded cursor-pointer transition-all hover:scale-105 ${getColorClass(
                                                    percentage
                                                )}`}
                                            >
                                                <span
                                                    className={`text-xs font-semibold ${getTextColorClass(
                                                        percentage
                                                    )}`}
                                                >
                                                    {percentage > 0 ? `${percentage}%` : "-"}
                                                </span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="text-xs">
                                                <p className="font-semibold">{nutrient.label}</p>
                                                <p>{item.label}</p>
                                                <p className="text-muted-foreground">
                                                    {percentage}% of goal
                                                </p>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    ))}

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-4 mt-6 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded bg-red-500" />
                            <span>&lt;50%</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded bg-yellow-500" />
                            <span>50-80%</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded bg-green-500" />
                            <span>80-120%</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded bg-blue-500" />
                            <span>&gt;120%</span>
                        </div>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
