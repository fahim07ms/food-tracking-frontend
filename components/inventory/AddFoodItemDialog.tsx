"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, ChevronDown, ChevronUp, Upload, Link as LinkIcon } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createFoodItemSchema, CreateFoodItemInput } from "@/lib/schemas";
import api from "@/lib/api";

interface AddFoodItemDialogProps {
    inventoryId: string;
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

export function AddFoodItemDialog({ inventoryId, onSuccess }: AddFoodItemDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<CreateFoodItemInput>({
        resolver: zodResolver(createFoodItemSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            serving_quantity: 1,
            serving_unit: "serving",
            serving_weight_grams: 100,
            metric_serving_amount: 100,
            metric_serving_unit: "g",
            calories: 0,
            protein: 0,
            carbohydrate: 0,
            fat_total: 0,
            fiber: undefined,
            sugar_total: undefined,
            sugar_added: undefined,
            fat_saturated: undefined,
            fat_trans: undefined,
            sodium: undefined,
            cholesterol: undefined,
            potassium: undefined,
            vitamin_a: undefined,
            vitamin_c: undefined,
            vitamin_d: undefined,
            calcium: undefined,
            iron: undefined,
            magnesium: undefined,
            zinc: undefined,
            expiration_hours: 24,
            image_url: "",
            tags: [],
            allergens: [],
            source: "User_Submission",
            addToInventory: true,
        },
    });

    // Removed auto-generation on every keystroke to prevent partial slugs
    // Slug will be generated on form submission if empty

    async function onSubmit(data: CreateFoodItemInput) {
        setIsLoading(true);
        try {
            // Ensure slug is generated
            if (!data.slug) {
                data.slug = generateSlug(data.name);
            }

            // Clean the data: convert empty strings to undefined for optional fields
            const cleanedData = {
                ...data,
                image_url: data.image_url === "" ? undefined : data.image_url,
                description: data.description === "" ? undefined : data.description,
            };

            // Create the food item first
            const response = await api.post("/food-items", cleanedData);
            console.log(response)
            const createdItemId = response.data.item._id;

            // If a file is selected, upload it
            if (selectedFile) {
                try {
                    const formData = new FormData();
                    formData.append("image", selectedFile);

                    const uploadResponse = await api.patch(
                        `/food-items/${createdItemId}/image`,
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );

                    toast.success("Food item added with image!");
                } catch (uploadError) {
                    console.error("Image upload failed:", uploadError);
                    toast.warning("Food item added, but image upload failed");
                }
            } else {
                toast.success("Food item added to inventory");
            }

            setOpen(false);
            form.reset({
                name: "",
                slug: "",
                description: "",
                serving_quantity: 1,
                serving_unit: "serving",
                serving_weight_grams: 100,
                metric_serving_amount: 100,
                metric_serving_unit: "g",
                calories: 0,
                protein: 0,
                carbohydrate: 0,
                fat_total: 0,
                fiber: undefined,
                sugar_total: undefined,
                sugar_added: undefined,
                fat_saturated: undefined,
                fat_trans: undefined,
                sodium: undefined,
                cholesterol: undefined,
                potassium: undefined,
                vitamin_a: undefined,
                vitamin_c: undefined,
                vitamin_d: undefined,
                calcium: undefined,
                iron: undefined,
                magnesium: undefined,
                zinc: undefined,
                expiration_hours: 24,
                image_url: "",
                tags: [],
                allergens: [],
                source: "User_Submission",
                addToInventory: true,
            });
            setShowAdvanced(false);
            setImagePreview("");
            setSelectedFile(null);
            onSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to add food item");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Food Item
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Food Item</DialogTitle>
                    <DialogDescription>
                        Add a new food item to your inventory with nutritional information.
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
                                        <Input
                                            placeholder="e.g., Chicken Breast"
                                            {...field}
                                            onBlur={(e) => {
                                                field.onBlur();
                                                // Generate slug when user finishes typing name
                                                if (e.target.value && !form.getValues("slug")) {
                                                    form.setValue("slug", generateSlug(e.target.value));
                                                }
                                            }}
                                        />
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

                        {/* Expiration Hours */}
                        <FormField
                            control={form.control}
                            name="expiration_hours"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expiration (hours) *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="1"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Food Item Image */}
                        <FormField
                            control={form.control}
                            name="image_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Food Image (optional)</FormLabel>
                                    <Tabs defaultValue="url" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="url">
                                                <LinkIcon className="h-4 w-4 mr-2" />
                                                URL
                                            </TabsTrigger>
                                            <TabsTrigger value="upload">
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="url" className="space-y-2">
                                            <FormControl>
                                                <Input
                                                    type="url"
                                                    placeholder="https://example.com/image.jpg"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setImagePreview(e.target.value);
                                                    }}
                                                />
                                            </FormControl>
                                        </TabsContent>

                                        <TabsContent value="upload" className="space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        // Validate file type
                                                        if (!file.type.startsWith("image/")) {
                                                            toast.error("Please select an image file");
                                                            return;
                                                        }

                                                        // Validate file size (max 5MB)
                                                        if (file.size > 5 * 1024 * 1024) {
                                                            toast.error("Image size should be less than 5MB");
                                                            return;
                                                        }

                                                        // Store the file for upload after creation
                                                        setSelectedFile(file);

                                                        // Generate preview
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setImagePreview(reader.result as string);
                                                        };
                                                        reader.readAsDataURL(file);

                                                        // Clear the URL field since we're using file upload
                                                        field.onChange("");
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-full"
                                                >
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Choose File
                                                </Button>
                                            </div>
                                        </TabsContent>
                                    </Tabs>

                                    {/* Image Preview */}
                                    {(imagePreview || field.value) && (
                                        <div className="mt-2 w-full aspect-video rounded-lg overflow-hidden bg-muted">
                                            <img
                                                src={imagePreview || field.value || ""}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={() => {
                                                    setImagePreview("");
                                                    toast.error("Failed to load image");
                                                }}
                                            />
                                        </div>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                            Add to Inventory
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
