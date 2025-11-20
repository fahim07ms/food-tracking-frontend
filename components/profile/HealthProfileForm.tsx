"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { updateHealthProfileSchema, UpdateHealthProfileInput } from "@/lib/schemas";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export function HealthProfileForm({ initialData }: { initialData?: any }) {
    const [isLoading, setIsLoading] = useState(false);
    const updateUser = useAuthStore((state) => state.updateUser);

    const form = useForm<UpdateHealthProfileInput>({
        resolver: zodResolver(updateHealthProfileSchema) as any,
        defaultValues: {
            birth_date: initialData?.birth_date ? new Date(initialData.birth_date) : undefined,
            gender: initialData?.gender || "male",
            height_cm: initialData?.height_cm || 0,
            current_weight_kg: initialData?.current_weight_kg || 0,
            // Optional fields
            body_fat_percentage: initialData?.body_fat_percentage,
            waist_circumference_cm: initialData?.waist_circumference_cm,
            hip_circumference_cm: initialData?.hip_circumference_cm,
            neck_circumference_cm: initialData?.neck_circumference_cm,
            activity_level_factor: initialData?.activity_level_factor,
            steps_daily_average: initialData?.steps_daily_average,
            sleep_hours_average: initialData?.sleep_hours_average,
            blood_glucose_fasting: initialData?.blood_glucose_fasting,
            hba1c: initialData?.hba1c,
            blood_pressure_systolic: initialData?.blood_pressure_systolic,
            blood_pressure_diastolic: initialData?.blood_pressure_diastolic,
            cholesterol_ldl: initialData?.cholesterol_ldl,
            cholesterol_hdl: initialData?.cholesterol_hdl,
        },
    });

    async function onSubmit(data: UpdateHealthProfileInput) {
        setIsLoading(true);
        try {
            const response = await api.put("/user/health-profile", data);
            updateUser({ healthProfile: response.data.user.healthProfile });
            toast.success("Health profile updated successfully");
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Health Profile</CardTitle>
                <CardDescription>
                    Update your physical metrics to get better recommendations.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="birth_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date of Birth</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                    >
                                                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                    captionLayout="dropdown"
                                                    fromYear={1940}
                                                    toYear={new Date().getFullYear()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="height_cm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Height (cm)</FormLabel>
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
                                name="current_weight_kg"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Weight (kg)</FormLabel>
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

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Body Composition</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="body_fat_percentage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Body Fat %</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(e.target.value ? e.target.valueAsNumber : undefined)} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="waist_circumference_cm"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Waist (cm)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(e.target.value ? e.target.valueAsNumber : undefined)} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="hip_circumference_cm"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hip (cm)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(e.target.value ? e.target.valueAsNumber : undefined)} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="neck_circumference_cm"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Neck (cm)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(e.target.value ? e.target.valueAsNumber : undefined)} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Activity & Sleep</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="activity_level_factor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Activity Level</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(parseFloat(value))}
                                                value={field.value?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select activity level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1.2">Sedentary (little or no exercise)</SelectItem>
                                                    <SelectItem value="1.375">Lightly Active (exercise 1-3 days/week)</SelectItem>
                                                    <SelectItem value="1.55">Moderately Active (exercise 3-5 days/week)</SelectItem>
                                                    <SelectItem value="1.725">Very Active (exercise 6-7 days/week)</SelectItem>
                                                    <SelectItem value="1.9">Extra Active (very intense exercise daily)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>Choose your typical activity level</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="steps_daily_average"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Daily Steps (Avg)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} onChange={(e) => field.onChange(e.target.value ? e.target.valueAsNumber : undefined)} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sleep_hours_average"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sleep Hours (Avg)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(e.target.value ? e.target.valueAsNumber : undefined)} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Biomarkers</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="blood_glucose_fasting"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fasting Glucose (mg/dL)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} onChange={(e) => field.onChange(e.target.value ? e.target.valueAsNumber : undefined)} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="hba1c"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>HbA1c (%)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(e.target.value ? e.target.valueAsNumber : undefined)} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="blood_pressure_systolic"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Systolic BP (mmHg)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} onChange={(e) => field.onChange(e.target.value ? e.target.valueAsNumber : undefined)} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="blood_pressure_diastolic"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Diastolic BP (mmHg)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} onChange={(e) => field.onChange(e.target.value ? e.target.valueAsNumber : undefined)} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cholesterol_ldl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>LDL Cholesterol (mg/dL)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(e.target.value ? e.target.valueAsNumber : undefined)} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cholesterol_hdl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>HDL Cholesterol (mg/dL)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(e.target.value ? e.target.valueAsNumber : undefined)} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Health Profile
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
