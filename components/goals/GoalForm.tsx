"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { createGoalSchema, CreateGoalInput } from "@/lib/schemas";
import api from "@/lib/api";

export function GoalForm({ onSuccess }: { onSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<CreateGoalInput>({
        resolver: zodResolver(createGoalSchema),
        defaultValues: {
            primary_goals: ["maintenance"],
            secondary_goals: [],
            allergies: [],
            activity_level: "sedentary",
            target_weight_kg: 0,
            current_weight_kg: 0,
        },
    });

    async function onSubmit(data: CreateGoalInput) {
        setIsLoading(true);
        try {
            await api.post("/user/goals", data);
            toast.success("Goal created successfully");
            setOpen(false);
            form.reset();
            onSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to create goal");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Goal
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Set a New Goal</DialogTitle>
                    <DialogDescription>
                        Define your health targets and preferences.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="current_weight_kg"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Weight (kg)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="target_weight_kg"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Target Weight (kg)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="activity_level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Activity Level</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select activity level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="sedentary">Sedentary</SelectItem>
                                            <SelectItem value="lightly_active">Lightly Active</SelectItem>
                                            <SelectItem value="moderately_active">Moderately Active</SelectItem>
                                            <SelectItem value="very_active">Very Active</SelectItem>
                                            <SelectItem value="extra_active">Extra Active</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="primary_goals"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Primary Goal</FormLabel>
                                        <FormDescription>
                                            Select your main objective.
                                        </FormDescription>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["weight_loss", "muscle_gain", "maintenance", "recomposition", "improve_endurance", "improve_health"].map((item) => (
                                            <FormField
                                                key={item}
                                                control={form.control}
                                                name="primary_goals"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(item as any)}
                                                                    onCheckedChange={(checked) => {
                                                                        // Only allow one primary goal for simplicity in UI, though schema allows array
                                                                        // Or allow multiple. Let's allow one for now to keep it simple or just replace array.
                                                                        // Actually schema says array. Let's just replace the array with single item for radio-like behavior
                                                                        // or allow multiple. Let's allow multiple.
                                                                        return checked
                                                                            ? field.onChange([...field.value, item])
                                                                            : field.onChange(
                                                                                field.value?.filter(
                                                                                    (value) => value !== item
                                                                                )
                                                                            )
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal capitalize">
                                                                {item.replace(/_/g, " ")}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="secondary_goals"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Secondary Goals</FormLabel>
                                        <FormDescription>
                                            Select additional objectives (optional).
                                        </FormDescription>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["better_sleep", "more_energy", "improve_mood", "improve_markers", "build_habits"].map((item) => (
                                            <FormField
                                                key={item}
                                                control={form.control}
                                                name="secondary_goals"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(item as any)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...(field.value || []), item])
                                                                            : field.onChange(
                                                                                field.value?.filter(
                                                                                    (value) => value !== item
                                                                                )
                                                                            )
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal capitalize">
                                                                {item.replace(/_/g, " ")}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="allergies"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Allergies</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter allergies separated by commas (e.g., peanuts, dairy, gluten)"
                                            value={field.value?.join(", ") || ""}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const allergies = value
                                                    .split(",")
                                                    .map(item => item.trim())
                                                    .filter(item => item.length > 0);
                                                field.onChange(allergies.length > 0 ? allergies : undefined);
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Separate multiple allergies with commas
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Goal
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
