"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useResourceStore } from "@/store/useResourceStore"
import { useInventoryStore } from "@/store/useInventoryStore"
import { ResourceCard } from "@/components/resources/resource-card"

export default function ResourcesPage() {
    const { resources } = useResourceStore()
    const { items } = useInventoryStore()
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("All")

    // Get categories present in inventory for recommendations
    const inventoryCategories = Array.from(new Set(items.map(item => item.category)))

    const filteredResources = resources.filter((resource) => {
        const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "All" || resource.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    const recommendedResources = resources.filter(resource =>
        inventoryCategories.includes(resource.category as any)
    )

    const otherResources = resources.filter(resource =>
        !inventoryCategories.includes(resource.category as any)
    )

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Sustainability Resources</h3>
                <p className="text-sm text-muted-foreground">
                    Tips and guides to help you reduce waste and save money.
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tips..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Categories</SelectItem>
                        <SelectItem value="Fruit">Fruit</SelectItem>
                        <SelectItem value="Vegetable">Vegetable</SelectItem>
                        <SelectItem value="Dairy">Dairy</SelectItem>
                        <SelectItem value="Grain">Grain</SelectItem>
                        <SelectItem value="Protein">Protein</SelectItem>
                        <SelectItem value="Waste Reduction">Waste Reduction</SelectItem>
                        <SelectItem value="Budget">Budget</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All Resources</TabsTrigger>
                    <TabsTrigger value="recommended">Recommended for You</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredResources.map((resource) => (
                            <ResourceCard
                                key={resource.id}
                                resource={resource}
                                isRecommended={inventoryCategories.includes(resource.category as any)}
                            />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="recommended" className="space-y-4">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {recommendedResources.length > 0 ? (
                            recommendedResources.map((resource) => (
                                <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                    isRecommended={true}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-muted-foreground py-12">
                                No specific recommendations based on your current inventory.
                                <br />
                                Add items to your inventory to get personalized tips!
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
