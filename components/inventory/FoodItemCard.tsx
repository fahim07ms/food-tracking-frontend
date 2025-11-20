"use client";

import { useState } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import api from "@/lib/api";

interface FoodItemCardProps {
    foodItem: any;
    inventoryId: string;
    onUpdate: () => void;
    onEdit: (foodItem: any) => void;
}

export function FoodItemCard({ foodItem, inventoryId, onUpdate, onEdit }: FoodItemCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        try {
            // First remove from inventory
            await api.delete(`/inventories/${inventoryId}/items/${foodItem._id}`);
            // Then delete the food item itself
            await api.delete(`/food-items/${foodItem._id}`);

            toast.success("Food item deleted");
            setDeleteDialogOpen(false);
            onUpdate();
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to delete food item");
        } finally {
            setIsDeleting(false);
        }
    }

    // Mock image URL
    const imageUrl = `https://placehold.co/400x200/png?text=${encodeURIComponent(foodItem.name)}`;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
            <div className="relative h-32 bg-gradient-to-br from-primary/10 to-primary/5">
                <img
                    src={imageUrl}
                    alt={foodItem.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <CardHeader className="pb-2">
                <h3 className="font-semibold text-base leading-tight line-clamp-1">{foodItem.name}</h3>
                {foodItem.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {foodItem.description}
                    </p>
                )}
            </CardHeader>

            <CardContent className="pb-2 space-y-2 flex-1">
                {/* Nutritional Info */}
                <div className="grid grid-cols-4 gap-1 text-xs">
                    <div className="bg-muted/50 rounded p-1.5 text-center">
                        <p className="text-[10px] text-muted-foreground">Cal</p>
                        <p className="font-semibold">{foodItem.calories}</p>
                    </div>
                    <div className="bg-muted/50 rounded p-1.5 text-center">
                        <p className="text-[10px] text-muted-foreground">Protein</p>
                        <p className="font-semibold">{foodItem.protein}g</p>
                    </div>
                    <div className="bg-muted/50 rounded p-1.5 text-center">
                        <p className="text-[10px] text-muted-foreground">Carbs</p>
                        <p className="font-semibold">{foodItem.carbohydrate}g</p>
                    </div>
                    <div className="bg-muted/50 rounded p-1.5 text-center">
                        <p className="text-[10px] text-muted-foreground">Fat</p>
                        <p className="font-semibold">{foodItem.fat_total}g</p>
                    </div>
                </div>

                {/* Serving Info */}
                <p className="text-[10px] text-muted-foreground">
                    Per {foodItem.serving_quantity} {foodItem.serving_unit} ({foodItem.serving_weight_grams}g)
                </p>

                {/* Tags & Allergens */}
                {((foodItem.tags && foodItem.tags.length > 0) || (foodItem.allergens && foodItem.allergens.length > 0)) && (
                    <div className="flex flex-wrap gap-1">
                        {foodItem.tags?.slice(0, 2).map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-[10px] px-1.5 py-0">
                                {tag}
                            </Badge>
                        ))}
                        {foodItem.allergens?.slice(0, 1).map((allergen: string, index: number) => (
                            <Badge key={index} variant="destructive" className="text-[10px] px-1.5 py-0">
                                {allergen}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-2 border-t gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => onEdit(foodItem)}
                >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                </Button>

                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1 h-8 text-xs"
                        >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Food Item</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete "{foodItem.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}
