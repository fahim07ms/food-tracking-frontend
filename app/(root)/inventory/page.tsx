"use client";

import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { InventoryList } from "@/components/inventory/InventoryList";
import { AddFoodItemDialog } from "@/components/inventory/AddFoodItemDialog";
import api from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function InventoryPage() {
    // Fetch user's inventory (singular - each user has one inventory)
    const { data: inventoryData, error, isLoading, mutate } = useSWR(
        "/inventory",
        fetcher
    );

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full items-center justify-center text-destructive">
                Failed to load inventory
            </div>
        );
    }

    const inventory = inventoryData?.inventory;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your food items and nutritional information
                    </p>
                </div>
                <AddFoodItemDialog inventoryId={inventory?._id} onSuccess={mutate} />
            </div>

            <InventoryList inventory={inventory} onUpdate={mutate} />
        </div>
    );
}
