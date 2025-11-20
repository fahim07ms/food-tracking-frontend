"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

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
            router.push("/");
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
                                        <FormItem>
                                            <FormLabel>Date of Birth</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    value={
                                                        field.value
                                                            ? new Date(
                                                                  field.value,
                                                              )
                                                                  .toISOString()
                                                                  .split("T")[0]
                                                            : ""
                                                    }
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target
                                                                .valueAsDate,
                                                        )
                                                    }
                                                />
                                            </FormControl>
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
