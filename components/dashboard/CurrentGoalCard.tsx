"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Activity } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export function CurrentGoalCard() {
    const { user } = useAuthStore();

    if (!user || !user.goals || user.goals.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Current Goal
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        No active goal set. Create a goal to track your nutritional progress.
                    </p>
                    <Link href="/goals">
                        <Button>Create Goal</Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    const currentGoalIndex = user.current_goal_index ?? 0;
    const currentGoal = user.goals[currentGoalIndex];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Current Goal
                    </CardTitle>
                    <Link href="/goals">
                        <Button variant="outline" size="sm">
                            View All Goals
                        </Button>
                    </Link>
                </div>
                <CardDescription>Your active nutritional targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Primary Goals */}
                {currentGoal.primary_goals && currentGoal.primary_goals.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Primary Goals
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {currentGoal.primary_goals.map((goal: string, index: number) => (
                                <Badge key={index} variant="default">
                                    {goal}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Activity Level */}
                {currentGoal.activity_level && (
                    <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Activity Level
                        </h4>
                        <Badge variant="secondary">{currentGoal.activity_level}</Badge>
                    </div>
                )}

                {/* Target Weight */}
                {currentGoal.target_weight_kg && (
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div>
                            <p className="text-sm text-muted-foreground">Current Weight</p>
                            <p className="text-lg font-semibold">{currentGoal.current_weight_kg} kg</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Target Weight</p>
                            <p className="text-lg font-semibold">{currentGoal.target_weight_kg} kg</p>
                        </div>
                    </div>
                )}

                {/* Key Nutritional Targets */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t">
                    <div>
                        <p className="text-xs text-muted-foreground">Calories</p>
                        <p className="text-sm font-semibold">{currentGoal.calories} kcal</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Protein</p>
                        <p className="text-sm font-semibold">{currentGoal.protein}g</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Carbs</p>
                        <p className="text-sm font-semibold">{currentGoal.carbohydrate}g</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Fat</p>
                        <p className="text-sm font-semibold">{currentGoal.fat_total}g</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
