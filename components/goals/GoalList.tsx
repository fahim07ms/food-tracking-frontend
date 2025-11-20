"use client";

import { useState } from "react";
import { Trash2, Loader2, Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { EditGoalDialog } from "./EditGoalDialog";
import api from "@/lib/api";

export function GoalList({ goals, currentGoalIndex, mutate }: { goals: any[]; currentGoalIndex: number | null; mutate: () => void }) {
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [isSettingCurrent, setIsSettingCurrent] = useState<number | null>(null);
    const [expandedGoals, setExpandedGoals] = useState<Set<number>>(new Set());

    async function handleDelete(index: number) {
        setIsDeleting(index);
        try {
            await api.delete(`/user/goals/${index}`);
            mutate();
            toast.success("Goal deleted");
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to delete goal");
        } finally {
            setIsDeleting(null);
        }
    }

    async function handleSetCurrent(index: number) {
        setIsSettingCurrent(index);
        try {
            await api.patch("/user/goals/current", { index });
            mutate();
            toast.success("Active goal updated");
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to update active goal");
        } finally {
            setIsSettingCurrent(null);
        }
    }

    const toggleExpanded = (index: number) => {
        setExpandedGoals(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    if (!goals || goals.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Your Goals</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">You haven't set any goals yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {goals.map((goal, index) => {
                const isCurrent = currentGoalIndex === index;
                const isExpanded = expandedGoals.has(index);
                return (
                    <Card key={index} className={isCurrent ? "border-primary" : ""}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg capitalize">
                                    {goal.primary_goals?.[0]?.replace(/_/g, " ") || "Goal"}
                                </CardTitle>
                                {isCurrent && <Badge>Active</Badge>}
                            </div>
                            <CardDescription>
                                Target: {goal.target_weight_kg} kg
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Current Weight:</span>
                                <span>{goal.current_weight_kg} kg</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Activity:</span>
                                <span className="capitalize">{goal.activity_level?.replace(/_/g, " ")}</span>
                            </div>

                            {/* Primary Goals */}
                            {goal.primary_goals && goal.primary_goals.length > 1 && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Other Primary Goals:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {goal.primary_goals.slice(1).map((g: string) => (
                                            <Badge key={g} variant="secondary" className="text-xs capitalize">
                                                {g.replace(/_/g, " ")}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Secondary Goals */}
                            {goal.secondary_goals && goal.secondary_goals.length > 0 && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Secondary Goals:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {goal.secondary_goals.map((g: string) => (
                                            <Badge key={g} variant="outline" className="text-xs capitalize">
                                                {g.replace(/_/g, " ")}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Allergies */}
                            {goal.allergies && goal.allergies.length > 0 && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Allergies:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {goal.allergies.map((allergy: string) => (
                                            <Badge key={allergy} variant="destructive" className="text-xs">
                                                {allergy}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Nutritional Targets - Expandable */}
                            <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(index)}>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm" className="w-full justify-between p-2">
                                        <span className="text-xs font-medium">Nutritional Targets</span>
                                        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="space-y-3 pt-2">
                                    {/* Macros */}
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground">Macronutrients</p>
                                        <div className="grid grid-cols-2 gap-1 text-xs">
                                            <div className="flex justify-between">
                                                <span>Calories:</span>
                                                <span className="font-medium">{Math.round(goal.calories || 0)} kcal</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Protein:</span>
                                                <span className="font-medium">{Math.round(goal.protein || 0)}g</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Carbs:</span>
                                                <span className="font-medium">{Math.round(goal.carbohydrate || 0)}g</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Fats:</span>
                                                <span className="font-medium">{Math.round(goal.fat_total || 0)}g</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Fiber:</span>
                                                <span className="font-medium">{Math.round(goal.fiber || 0)}g</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Minerals */}
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground">Minerals (mg)</p>
                                        <div className="grid grid-cols-2 gap-1 text-xs">
                                            <div className="flex justify-between">
                                                <span>Sodium:</span>
                                                <span className="font-medium">{Math.round(goal.sodium || 0)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Cholesterol:</span>
                                                <span className="font-medium">{Math.round(goal.cholesterol || 0)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Potassium:</span>
                                                <span className="font-medium">{Math.round(goal.potassium || 0)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Calcium:</span>
                                                <span className="font-medium">{Math.round(goal.calcium || 0)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Iron:</span>
                                                <span className="font-medium">{Math.round(goal.iron || 0)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Magnesium:</span>
                                                <span className="font-medium">{Math.round(goal.magnesium || 0)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vitamins */}
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground">Vitamins</p>
                                        <div className="grid grid-cols-2 gap-1 text-xs">
                                            <div className="flex justify-between">
                                                <span>Vitamin A:</span>
                                                <span className="font-medium">{Math.round(goal.vitamin_a || 0)} μg</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Vitamin C:</span>
                                                <span className="font-medium">{Math.round(goal.vitamin_c || 0)} mg</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Vitamin D:</span>
                                                <span className="font-medium">{Math.round(goal.vitamin_d || 0)} μg</span>
                                            </div>
                                        </div>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </CardContent>
                        <CardFooter className="flex justify-between gap-2">
                            <div className="flex gap-2">
                                <Button
                                    variant={isCurrent ? "secondary" : "outline"}
                                    size="sm"
                                    onClick={() => handleSetCurrent(index)}
                                    disabled={isSettingCurrent === index || isCurrent}
                                >
                                    {isSettingCurrent === index ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : isCurrent ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Active
                                        </>
                                    ) : (
                                        "Set Active"
                                    )}
                                </Button>
                                <EditGoalDialog goal={goal} index={index} onSuccess={mutate} />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(index)}
                                disabled={isDeleting === index}
                            >
                                {isDeleting === index ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
