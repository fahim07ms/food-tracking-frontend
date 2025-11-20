"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { updateFoodItemSchema, UpdateFoodItemInput } from "@/lib/schemas";
import api from "@/lib/api";

interface EditFoodItemDialogProps {
    foodItem: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function EditFoodItemDialog({
    foodItem,
    open,
    onOpenChange,
    onSuccess,
}: EditFoodItemDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const form = useForm<UpdateFoodItemInput>({
        resolver: zodResolver(updateFoodItemSchema),
    });

    // Reset form when foodItem changes
    useEffect(() => {
        if (foodItem && open) {
            form.reset({
                name: foodItem.name || "",
                slug: foodItem.slug || "",
                description: foodItem.description || "",
                serving_quantity: foodItem.serving_quantity || 1,
                serving_unit: foodItem.serving_unit || "serving",
                serving_weight_grams: foodItem.serving_weight_grams || 100,
                metric_serving_amount: foodItem.metric_serving_amount || 100,
                metric_serving_unit: foodItem.metric_serving_unit || "g",
                calories: foodItem.calories || 0,
                protein: foodItem.protein || 0,
                carbohydrate: foodItem.carbohydrate || 0,
                fat_total: foodItem.fat_total || 0,
                fiber: foodItem.fiber,
                sugar_total: foodItem.sugar_total,
                sugar_added: foodItem.sugar_added,
                fat_saturated: foodItem.fat_saturated,
                fat_trans: foodItem.fat_trans,
                sodium: foodItem.sodium,
                cholesterol: foodItem.cholesterol,
                potassium: foodItem.potassium,
                vitamin_a: foodItem.vitamin_a,
                vitamin_c: foodItem.vitamin_c,
                vitamin_d: foodItem.vitamin_d,
                calcium: foodItem.calcium,
                iron: foodItem.iron,
                magnesium: foodItem.magnesium,
                zinc: foodItem.zinc,
                tags: foodItem.tags || [],
                allergens: foodItem.allergens || [],
            });
        }
    }, [foodItem, open, form]);

    async function onSubmit(data: UpdateFoodItemInput) {
        setIsLoading(true);
        try {
            // Update slug if name changed
            if (data.name && data.name !== foodItem.name) {
                data.slug = generateSlug(data.name);
            }

            await api.patch(`/food-items/${foodItem._id}`, data);
            toast.success("Food item updated");
            onOpenChange(false);
            setShowAdvanced(false);
            onSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update food item");
        } finally {
            setIsLoading(false);
        }
    }

    if (!foodItem) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Food Item</DialogTitle>
                    <DialogDescription>
                        Update the nutritional information for this food item.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Basic Fields */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Chicken Breast" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Optional description..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Serving Information */}
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="serving_quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Serving Qty *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.1"
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
                                name="serving_unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unit *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., cup" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="serving_weight_grams"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Weight (g) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Core Macros */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="calories"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Calories (kcal) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.1"
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
                                name="protein"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Protein (g) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.1"
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
                                name="carbohydrate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Carbs (g) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.1"
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
                                name="fat_total"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fat (g) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Advanced Options Toggle */}
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                        >
                            {showAdvanced ? (
                                <>
                                    <ChevronUp className="mr-2 h-4 w-4" />
                                    Hide Advanced Options
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="mr-2 h-4 w-4" />
                                    Show Advanced Options
                                </>
                            )}
                        </Button>

                        {/* Advanced Fields */}
                        {showAdvanced && (
                            <div className="space-y-4 border-t pt-4">
                                <h4 className="font-medium text-sm">Detailed Nutrients</h4>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="fiber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fiber (g)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="sugar_total"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Total Sugar (g)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="fat_saturated"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Saturated Fat (g)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="sodium"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sodium (mg)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="cholesterol"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cholesterol (mg)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="potassium"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Potassium (mg)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <h4 className="font-medium text-sm pt-2">Vitamins & Minerals</h4>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="vitamin_a"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Vitamin A (μg)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="vitamin_c"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Vitamin C (mg)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="calcium"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Calcium (mg)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="iron"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Iron (mg)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <h4 className="font-medium text-sm pt-2">Tags & Allergens</h4>

                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tags (comma-separated)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., protein, lean, poultry"
                                                    value={field.value?.join(", ") || ""}
                                                    onChange={(e) => {
                                                        const tags = e.target.value
                                                            .split(",")
                                                            .map((t) => t.trim())
                                                            .filter((t) => t.length > 0);
                                                        field.onChange(tags);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="allergens"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Allergens (comma-separated)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., dairy, nuts, soy"
                                                    value={field.value?.join(", ") || ""}
                                                    onChange={(e) => {
                                                        const allergens = e.target.value
                                                            .split(",")
                                                            .map((a) => a.trim())
                                                            .filter((a) => a.length > 0);
                                                        field.onChange(allergens);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Food Item
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
