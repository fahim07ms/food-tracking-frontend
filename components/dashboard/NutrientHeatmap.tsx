"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { SingleDayHeatmap } from "./heatmap/SingleDayHeatmap";
import { WeeklyHeatmap } from "./heatmap/WeeklyHeatmap";
import { MonthlyHeatmap } from "./heatmap/MonthlyHeatmap";

type PeriodType = "single-day" | "weekly" | "monthly";

export function NutrientHeatmap() {
    const [periodType, setPeriodType] = useState<PeriodType>("weekly");
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Nutrient Analytics
                        </CardTitle>
                        <CardDescription>Track your nutrition progress over time</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Period Type Selector */}
                        <Select
                            value={periodType}
                            onValueChange={(value) => setPeriodType(value as PeriodType)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="single-day">Single Day</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Date Picker */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-[200px] justify-start text-left font-normal",
                                        !selectedDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? (
                                        periodType === "monthly" ? (
                                            format(selectedDate, "MMMM yyyy")
                                        ) : (
                                            format(selectedDate, "PPP")
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => date && setSelectedDate(date)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {periodType === "single-day" && <SingleDayHeatmap date={selectedDate} />}
                {periodType === "weekly" && <WeeklyHeatmap startDate={selectedDate} />}
                {periodType === "monthly" && <MonthlyHeatmap date={selectedDate} />}
            </CardContent>
        </Card>
    );
}
