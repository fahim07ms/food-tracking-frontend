"use client";

import { CurrentGoalCard } from "@/components/dashboard/CurrentGoalCard";
import { InventoryExpirationCard } from "@/components/dashboard/InventoryExpirationCard";
import { SdgImpactCard } from "@/components/dashboard/SdgImpactCard";
import { NutrientHeatmap } from "@/components/dashboard/NutrientHeatmap";
import { ResourceRecommendations } from "@/components/dashboard/ResourceRecommendations";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6 pb-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Your health and sustainability overview
                </p>
            </div>

            {/* Current Goal - Full Width */}
            <CurrentGoalCard />

            {/* Inventory & SDG Impact - 2 Column Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                <InventoryExpirationCard />
                <SdgImpactCard />
            </div>

            {/* Nutrient Heatmap - Full Width */}
            <NutrientHeatmap />

            {/* Resource Recommendations - Full Width */}
            <ResourceRecommendations />
        </div>
    );
}
