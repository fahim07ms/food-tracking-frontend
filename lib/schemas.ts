import { z } from "zod";

// --- Auth Schemas ---
export const registerSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// --- User Schemas ---
export const updateHealthProfileSchema = z.object({
    birth_date: z.coerce.date(),
    gender: z.enum(["male", "female"]),
    height_cm: z.number().positive("Height must be positive"),
    current_weight_kg: z.number().positive("Weight must be positive"),

    body_fat_percentage: z.number().optional(),
    waist_circumference_cm: z.number().optional(),
    hip_circumference_cm: z.number().optional(),
    neck_circumference_cm: z.number().optional(),

    activity_level_factor: z.number().positive("Activity level is required"),
    steps_daily_average: z.number().int().optional(),
    sleep_hours_average: z.number().optional(),

    blood_glucose_fasting: z.number().int().optional(),
    hba1c: z.number().optional(),
    blood_pressure_systolic: z.number().int().optional(),
    blood_pressure_diastolic: z.number().int().optional(),
    cholesterol_ldl: z.number().optional(),
    cholesterol_hdl: z.number().optional(),
});

export type UpdateHealthProfileInput = z.infer<typeof updateHealthProfileSchema>;

export const updateProfileSchema = z
    .object({
        fullName: z.string().min(2).optional().or(z.literal("")),
        currentPassword: z.string().min(6).optional().or(z.literal("")),
        newPassword: z.string().min(6).optional().or(z.literal("")),
    })
    .refine(
        (data) => !!data.fullName || !!data.newPassword,
        "fullName or newPassword must be provided"
    )
    .refine(
        (data) => !data.newPassword || !!data.currentPassword,
        "currentPassword is required when changing password"
    );

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const addFoodLogSchema = z.object({
    date: z.date(),
    time: z.string().min(1, "Time is required"),
    foodItemId: z.string().min(1, "Food item is required"),
    quantity: z.number().positive("Quantity must be positive"),
});

export type AddFoodLogInput = z.infer<typeof addFoodLogSchema>;

const primaryGoalEnum = z.enum([
    "weight_loss",
    "muscle_gain",
    "maintenance",
    "recomposition",
    "improve_endurance",
    "improve_health",
]);

const secondaryGoalEnum = z.enum([
    "better_sleep",
    "more_energy",
    "improve_mood",
    "improve_markers",
    "build_habits",
]);

const activityLevelEnum = z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extra_active",
]);

export const createGoalSchema = z.object({
    primary_goals: z.array(primaryGoalEnum).nonempty("Select at least one primary goal"),
    secondary_goals: z.array(secondaryGoalEnum).optional(),
    allergies: z.array(z.string()).optional(),
    activity_level: activityLevelEnum,
    target_weight_kg: z.number().positive("Target weight must be positive"),
    current_weight_kg: z.number().positive("Current weight must be positive"),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;

export const updateGoalSchema = z.object({
    primary_goals: z.array(primaryGoalEnum).nonempty().optional(),
    secondary_goals: z.array(secondaryGoalEnum).optional(),
    allergies: z.array(z.string()).optional(),
    activity_level: activityLevelEnum.optional(),
    target_weight_kg: z.number().positive().optional(),
    current_weight_kg: z.number().positive().optional(),
});

export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;

export const setCurrentGoalSchema = z.object({
    index: z.number().int().nonnegative(),
});

export type SetCurrentGoalInput = z.infer<typeof setCurrentGoalSchema>;

// --- Food & Inventory Schemas ---
export const createFoodItemSchema = z.object({
    // Basic info
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),

    // Measurement & serving logic
    serving_quantity: z.number().positive(),
    serving_unit: z.string().min(1),
    serving_weight_grams: z.number().positive(),
    metric_serving_amount: z.number().positive(),
    metric_serving_unit: z.string().min(1),

    // Nutritional data (normalized, usually per 100g / 100ml)
    calories: z.number(),
    protein: z.number(),
    carbohydrate: z.number(),
    fat_total: z.number(),

    fiber: z.number().optional(),
    sugar_total: z.number().optional(),
    sugar_added: z.number().optional(),
    fat_saturated: z.number().optional(),
    fat_trans: z.number().optional(),
    sodium: z.number().optional(),
    cholesterol: z.number().optional(),
    potassium: z.number().optional(),

    vitamin_a: z.number().optional(),
    vitamin_c: z.number().optional(),
    vitamin_d: z.number().optional(),
    calcium: z.number().optional(),
    iron: z.number().optional(),
    magnesium: z.number().optional(),
    zinc: z.number().optional(),

    // Expiration info
    expiration_hours: z.number().positive(),

    // Image
    image_url: z.string().url().optional().or(z.literal("")),

    tags: z.array(z.string()).optional(),
    allergens: z.array(z.string()).optional(),
    source: z.string().optional(),

    // Optional: add to user's inventory immediately after creation
    addToInventory: z.boolean().optional(),
});

export type CreateFoodItemInput = z.infer<typeof createFoodItemSchema>;

export const updateFoodItemSchema = createFoodItemSchema.partial();

export type UpdateFoodItemInput = z.infer<typeof updateFoodItemSchema>;

export const updateInventorySchema = z.object({
    name: z.string().min(1).optional(),
});

export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;

export const addInventoryItemSchema = z.object({
    foodItemId: z.string().min(1, "Food item is required"),
});

export type AddInventoryItemInput = z.infer<typeof addInventoryItemSchema>;

// --- Resource Schemas ---
export const createResourceSchema = z.object({
    title: z.string().min(1, "Title is required").trim(),
    tags: z.array(z.string()).default([]),
    content: z.string().min(1, "Content is required"),
    video_url: z.string().url("Invalid URL format").optional(),
    type: z.enum(["article", "video"], {
        message: "Type must be either 'article' or 'video'",
    }),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;

export const updateResourceSchema = z.object({
    title: z.string().min(1, "Title is required").trim().optional(),
    tags: z.array(z.string()).optional(),
    content: z.string().min(1, "Content is required").optional(),
    video_url: z.string().url("Invalid URL format").optional().nullable(),
    type: z.enum(["article", "video"]).optional(),
});

export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;

export const getResourcesQuerySchema = z.object({
    type: z.enum(["article", "video"]).optional(),
    tag: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
});

export type GetResourcesQueryInput = z.infer<typeof getResourcesQuerySchema>;

// --- Mock Upload Schema ---
export const mockUploadSchema = z.object({
    file: z.instanceof(File, { message: "File is required" }),
});

// --- Chat Schemas ---
export const createChatSessionSchema = z.object({
    title: z.string().min(1, "Title is required"),
    systemInstruction: z.string().optional(),
});

export type CreateChatSessionInput = z.infer<typeof createChatSessionSchema>;

export const sendChatMessageSchema = z.object({
    message: z.string().min(1, "Message cannot be empty"),
});

export type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>;
