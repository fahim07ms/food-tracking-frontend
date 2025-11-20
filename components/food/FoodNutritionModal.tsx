"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";

interface FoodNutritionModalProps {
    foodItem: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FoodNutritionModal({ foodItem, open, onOpenChange }: FoodNutritionModalProps) {
    if (!foodItem) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{foodItem.name}</DialogTitle>
                    {foodItem.description && (
                        <DialogDescription className="text-base">
                            {foodItem.description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="space-y-6">
                    {/* Food Image */}
                    {foodItem.image_url && (
                        <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
                            <img
                                src={foodItem.image_url}
                                alt={foodItem.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Expiration Info */}
                    {foodItem.expiration_hours && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                            <Clock className="h-4 w-4" />
                            <span>
                                Typical shelf life: {foodItem.expiration_hours < 24
                                    ? `${foodItem.expiration_hours} hours`
                                    : `${Math.round(foodItem.expiration_hours / 24)} days`}
                            </span>
                        </div>
                    )}

                    {/* Serving Info */}
                    <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-2">SERVING SIZE</h3>
                        <p className="text-sm">
                            {foodItem.serving_quantity} {foodItem.serving_unit} ({foodItem.serving_weight_grams}g)
                        </p>
                    </div>

                    <Separator />

                    {/* Core Macros */}
                    <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-3">MACRONUTRIENTS</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-muted/50 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground">Calories</p>
                                <p className="text-2xl font-bold">{foodItem.calories}</p>
                                <p className="text-xs text-muted-foreground">kcal</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground">Protein</p>
                                <p className="text-2xl font-bold">{foodItem.protein}</p>
                                <p className="text-xs text-muted-foreground">grams</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground">Carbohydrates</p>
                                <p className="text-2xl font-bold">{foodItem.carbohydrate}</p>
                                <p className="text-xs text-muted-foreground">grams</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground">Total Fat</p>
                                <p className="text-2xl font-bold">{foodItem.fat_total}</p>
                                <p className="text-xs text-muted-foreground">grams</p>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Nutrients */}
                    {(foodItem.fiber || foodItem.sugar_total || foodItem.fat_saturated || foodItem.sodium) && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="font-semibold text-sm text-muted-foreground mb-3">DETAILED NUTRIENTS</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {foodItem.fiber !== undefined && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Fiber</span>
                                            <span className="font-medium">{foodItem.fiber}g</span>
                                        </div>
                                    )}
                                    {foodItem.sugar_total !== undefined && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Total Sugar</span>
                                            <span className="font-medium">{foodItem.sugar_total}g</span>
                                        </div>
                                    )}
                                    {foodItem.sugar_added !== undefined && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Added Sugar</span>
                                            <span className="font-medium">{foodItem.sugar_added}g</span>
                                        </div>
                                    )}
                                    {foodItem.fat_saturated !== undefined && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Saturated Fat</span>
                                            <span className="font-medium">{foodItem.fat_saturated}g</span>
                                        </div>
                                    )}
                                    {foodItem.fat_trans !== undefined && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Trans Fat</span>
                                            <span className="font-medium">{foodItem.fat_trans}g</span>
                                        </div>
                                    )}
                                    {foodItem.sodium !== undefined && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Sodium</span>
                                            <span className="font-medium">{foodItem.sodium}mg</span>
                                        </div>
                                    )}
                                    {foodItem.cholesterol !== undefined && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Cholesterol</span>
                                            <span className="font-medium">{foodItem.cholesterol}mg</span>
                                        </div>
                                    )}
                                    {foodItem.potassium !== undefined && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Potassium</span>
                                            <span className="font-medium">{foodItem.potassium}mg</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Vitamins & Minerals */}
                    {(foodItem.vitamin_a || foodItem.vitamin_c || foodItem.calcium || foodItem.iron) && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="font-semibold text-sm text-muted-foreground mb-3">VITAMINS & MINERALS</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {foodItem.vitamin_a !== undefined && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Vitamin A</span>
                                            <span className="font-medium">{foodItem.vitamin_a}μg</span>
                                        </div>
                                    )}
                                    {foodItem.vitamin_c !== undefined && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Vitamin C</span>
                                            <span className="font-medium">{foodItem.vitamin_c}mg</span>
                                        </div>
                                    )}
                                    {foodItem.vitamin_d !== undefined && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Vitamin D</span>
                                            <span className="font-medium">{foodItem.vitamin_d}μg</span>
                                        </div>
                                    )}
                                    {foodItem.calcium !== undefined && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Calcium</span>
                                            <span className="font-medium">{foodItem.calcium}mg</span>
                                        </div>
                                    )}
                                    {foodItem.iron !== undefined && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Iron</span>
                                            <span className="font-medium">{foodItem.iron}mg</span>
                                        </div>
                                    )}
                                    {foodItem.magnesium !== undefined && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Magnesium</span>
                                            <span className="font-medium">{foodItem.magnesium}mg</span>
                                        </div>
                                    )}
                                    {foodItem.zinc !== undefined && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Zinc</span>
                                            <span className="font-medium">{foodItem.zinc}mg</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Tags & Allergens */}
                    {((foodItem.tags && foodItem.tags.length > 0) || (foodItem.allergens && foodItem.allergens.length > 0)) && (
                        <>
                            <Separator />
                            <div className="space-y-3">
                                {foodItem.tags && foodItem.tags.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-sm text-muted-foreground mb-2">TAGS</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {foodItem.tags.map((tag: string, index: number) => (
                                                <Badge key={index} variant="secondary">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {foodItem.allergens && foodItem.allergens.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-sm text-muted-foreground mb-2">ALLERGENS</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {foodItem.allergens.map((allergen: string, index: number) => (
                                                <Badge key={index} variant="destructive">
                                                    {allergen}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
