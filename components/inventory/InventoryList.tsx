"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FoodItemCard } from "./FoodItemCard";
import { EditFoodItemDialog } from "./EditFoodItemDialog";

interface InventoryListProps {
    inventory: any;
    onUpdate: () => void;
}

export function InventoryList({ inventory, onUpdate }: InventoryListProps) {
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const foodItems = inventory?.foodItems || [];

    function handleEdit(foodItem: any) {
        setEditingItem(foodItem);
        setEditDialogOpen(true);
    }

    function handleEditSuccess() {
        onUpdate();
    }

    if (!foodItems || foodItems.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>My Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        Your inventory is empty. Add your first food item to get started!
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {foodItems.map((foodItem: any) => (
                    <FoodItemCard
                        key={foodItem._id}
                        foodItem={foodItem}
                        inventoryId={inventory._id}
                        onUpdate={onUpdate}
                        onEdit={handleEdit}
                    />
                ))}
            </div>

            {editingItem && (
                <EditFoodItemDialog
                    foodItem={editingItem}
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    onSuccess={handleEditSuccess}
                />
            )}
        </>
    );
}
