"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    Loader2,
    ChevronRight,
    ChevronLeft,
    Calendar as CalendarIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
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
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    updateHealthProfileSchema,
    UpdateHealthProfileInput,
} from "@/lib/schemas";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const steps = [
    {
        id: "birth_date",
        title: "Date of Birth",
        description: "Let's start with your age.",
    },
    {
        id: "gender",
        title: "Gender",
        description: "This helps us calculate your metabolic rate.",
    },
    { id: "height_cm", title: "Height", description: "How tall are you?" },
    {
        id: "current_weight_kg",
        title: "Weight",
        description: "What is your current weight?",
    },
    {
        id: "activity_level_factor",
        title: "Activity Level",
        description: "How active are you on a typical day?",
    },
];

export function HealthProfileWizard() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const updateUser = useAuthStore((state) => state.updateUser);
    const router = useRouter();

    const form = useForm<UpdateHealthProfileInput>({
        resolver: zodResolver(updateHealthProfileSchema) as any,
        mode: "onChange",
        defaultValues: {
            gender: "male",
            birth_date: undefined,
            height_cm: undefined,
            current_weight_kg: undefined,
            activity_level_factor: undefined,
        },
    });

    const { trigger, getValues } = form;

    const handleNext = async () => {
        const fields = steps[currentStep].id;
        const isValid = await trigger(fields as any);

        if (isValid) {
            if (currentStep < steps.length - 1) {
                setCurrentStep((prev) => prev + 1);
            } else {
                await onSubmit(getValues());
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    async function onSubmit(data: UpdateHealthProfileInput) {
        setIsLoading(true);
        try {
            const response = await api.put("/user/health-profile", data);
            updateUser({ healthProfile: response.data.user.healthProfile });
            toast.success("Health profile created successfully!");
            router.push("/dashboard");
        } catch (error: any) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                    "Failed to create health profile",
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        Step {currentStep + 1} of {steps.length}
                    </CardTitle>
                    <CardDescription>
                        {steps[currentStep].description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form className="space-y-4">
                            {currentStep === 0 && (
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
                                                            {field.value
                                                                ? format(
                                                                      field.value,
                                                                      "PPP",
                                                                  )
                                                                : "Pick a date"}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={
                                                            field.onChange
                                                        }
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
                            )}

                            {currentStep === 1 && (
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="male">
                                                        Male
                                                    </SelectItem>
                                                    <SelectItem value="female">
                                                        Female
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {currentStep === 2 && (
                                <FormField
                                    control={form.control}
                                    name="height_cm"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Height (cm)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="175"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target
                                                                .valueAsNumber,
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {currentStep === 3 && (
                                <FormField
                                    control={form.control}
                                    name="current_weight_kg"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Weight (kg)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="70"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target
                                                                .valueAsNumber,
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {currentStep === 4 && (
                                <FormField
                                    control={form.control}
                                    name="activity_level_factor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Activity Level
                                            </FormLabel>
                                            <Select
                                                onValueChange={(value) =>
                                                    field.onChange(
                                                        parseFloat(value),
                                                    )
                                                }
                                                value={field.value?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select your activity level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1.2">
                                                        Sedentary (little or no
                                                        exercise)
                                                    </SelectItem>
                                                    <SelectItem value="1.375">
                                                        Lightly Active (exercise
                                                        1-3 days/week)
                                                    </SelectItem>
                                                    <SelectItem value="1.55">
                                                        Moderately Active
                                                        (exercise 3-5 days/week)
                                                    </SelectItem>
                                                    <SelectItem value="1.725">
                                                        Very Active (exercise
                                                        6-7 days/week)
                                                    </SelectItem>
                                                    <SelectItem value="1.9">
                                                        Extra Active (very
                                                        intense exercise daily)
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 0 || isLoading}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <Button onClick={handleNext} disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : currentStep === steps.length - 1 ? (
                            "Finish"
                        ) : (
                            <>
                                Next
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
