"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    preferences: z.string().optional(),
    mealCount: z.coerce.number().int().min(1).max(10).default(3),
    budget: z.coerce.number().positive().optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

interface MealPlanFormProps {
    onSubmit: (data: { preferences?: string; mealCount: number; budget?: number }) => Promise<void>;
    isLoading: boolean;
}

export function MealPlanForm({ onSubmit, isLoading }: MealPlanFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mealCount: 3,
        },
    });

    const onFormSubmit = async (data: FormData) => {
        await onSubmit({
            preferences: data.preferences || undefined,
            mealCount: data.mealCount,
            budget: typeof data.budget === 'number' ? data.budget : undefined,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Generate AI Meal Plan</CardTitle>
                <CardDescription>
                    Create a personalized meal plan based on your inventory and nutritional goals
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="preferences">Preferences (Optional)</Label>
                        <Textarea
                            id="preferences"
                            placeholder="E.g., vegetarian, low carb, no dairy..."
                            {...register("preferences")}
                            disabled={isLoading}
                        />
                        {errors.preferences && (
                            <p className="text-sm text-destructive">{errors.preferences.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mealCount">Number of Meals</Label>
                        <Input
                            id="mealCount"
                            type="number"
                            min={1}
                            max={10}
                            {...register("mealCount")}
                            disabled={isLoading}
                        />
                        {errors.mealCount && (
                            <p className="text-sm text-destructive">{errors.mealCount.message}</p>
                        )}
                        <p className="text-sm text-muted-foreground">Choose between 1-10 meals</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="budget">Budget (Optional, in BDT)</Label>
                        <Input
                            id="budget"
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="Enter your budget in BDT"
                            {...register("budget")}
                            disabled={isLoading}
                        />
                        {errors.budget && (
                            <p className="text-sm text-destructive">{errors.budget.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Meal Plan
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
