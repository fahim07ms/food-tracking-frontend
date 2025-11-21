"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Leaf, TrendingUp, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { getSdgImpactReport } from "@/lib/analyticsApi";
import { SdgImpactReport } from "@/lib/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";

export function SdgImpactCard() {
    const [data, setData] = useState<SdgImpactReport | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Get data for the current week (starting from last Sunday)
                const today = new Date();
                const dayOfWeek = today.getDay();
                const startDate = new Date(today);
                startDate.setDate(today.getDate() - dayOfWeek);

                const result = await getSdgImpactReport(startDate.toISOString().split('T')[0]);
                setData(result);
            } catch (err: any) {
                setError(err?.response?.data?.message || "Failed to load SDG impact report");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>SDG Impact Score</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>SDG Impact Score</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </CardContent>
            </Card>
        );
    }

    if (!data) return null;

    // Calculate progress value (0-100)
    const progressValue = data.score || 0;

    // Helper to get color based on score
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const getProgressColor = (score: number) => {
        if (score >= 80) return "bg-green-600";
        if (score >= 60) return "bg-yellow-600";
        return "bg-red-600";
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    SDG Impact Score
                </CardTitle>
                <CardDescription>
                    Your sustainability and nutrition performance this week
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="flex flex-col items-center justify-center py-6">
                    <div className={`text-4xl font-bold mb-1 ${getScoreColor(progressValue)}`}>
                        {progressValue}
                        <span className="text-lg font-normal text-muted-foreground ml-1">
                            /100
                        </span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">Overall Score</div>
                    <Progress
                        value={progressValue}
                        className="h-3 w-full mb-6"
                        indicatorClassName={getProgressColor(progressValue)}
                    />

                    <div className="grid grid-cols-2 gap-4 w-full mb-6">
                        <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium mb-1">Nutrition</span>
                            <span className="text-xl font-bold">
                                {data.components.nutritionScore}
                            </span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium mb-1">Waste Mgmt</span>
                            <span className="text-xl font-bold">
                                {data.components.wasteScore}
                            </span>
                        </div>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="nutrition">
                            <AccordionTrigger>
                                <span className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-blue-600" />
                                    Nutrition Summary
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-3 pt-2">
                                    {data.weeklySummary.weeklyAveragePercentages ? (
                                        <>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span>Calories</span>
                                                    <span>{data.weeklySummary.weeklyAveragePercentages.calories}%</span>
                                                </div>
                                                <Progress value={Math.min(data.weeklySummary.weeklyAveragePercentages.calories, 100)} className="h-2" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span>Protein</span>
                                                    <span>{data.weeklySummary.weeklyAveragePercentages.protein}%</span>
                                                </div>
                                                <Progress value={Math.min(data.weeklySummary.weeklyAveragePercentages.protein, 100)} className="h-2" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span>Fiber</span>
                                                    <span>{data.weeklySummary.weeklyAveragePercentages.fiber}%</span>
                                                </div>
                                                <Progress value={Math.min(data.weeklySummary.weeklyAveragePercentages.fiber, 100)} className="h-2" />
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No nutrition data available</p>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="waste">
                            <AccordionTrigger>
                                <span className="flex items-center gap-2">
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                    Inventory Waste Summary
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 pt-2 text-sm">
                                    {data.inventorySummary ? (
                                        <>
                                            <div className="flex justify-between">
                                                <span>Healthy Items:</span>
                                                <span className="font-medium text-green-600">{data.inventorySummary.healthyCount}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Warning Items:</span>
                                                <span className="font-medium text-yellow-600">{data.inventorySummary.warningCount}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Wasted Items:</span>
                                                <span className="font-medium text-red-600">{data.inventorySummary.wastedCount}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-muted-foreground">No inventory data available</p>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Strengths */}
                        {data.strengths && Array.isArray(data.strengths) && data.strengths.length > 0 && (
                            <AccordionItem value="strengths">
                                <AccordionTrigger>
                                    <span className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        Strengths
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-2 pt-2">
                                        {data.strengths.map((strength: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2 text-sm">
                                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        )}

                        {/* Action Plan */}
                        {data.actionPlan && (
                            <AccordionItem value="action-plan">
                                <AccordionTrigger>
                                    <span className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-blue-600" />
                                        Action Plan
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="pt-2 text-sm text-muted-foreground">
                                        {data.actionPlan}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                    </Accordion>
                </div>
            </CardContent>
        </Card>
    );
}
