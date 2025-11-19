"use client"

import { useEffect, useState } from "react"
import { Package, AlertTriangle, Leaf, History } from "lucide-react"
import { SummaryCard } from "@/components/dashboard/summary-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useInventoryStore } from "@/store/useInventoryStore"
import { useConsumptionStore } from "@/store/useConsumptionStore"
import { useResourceStore } from "@/store/useResourceStore"
import { useAuthStore } from "@/store/useAuthStore"
import Link from "next/link"

export default function DashboardPage() {
    const { user } = useAuthStore()
    const { items } = useInventoryStore()
    const { logs } = useConsumptionStore()
    const { resources } = useResourceStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // Calculate stats
    const totalItems = items.length
    const lowStockItems = items.filter(item => item.quantity < 2).length
    const expiringSoon = items.filter(item => {
        const daysUntilExpiration = Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
        return daysUntilExpiration <= 3 && daysUntilExpiration >= 0
    }).length

    // Simple recommendation logic
    const recommendedResources = resources.slice(0, 3) // Just show first 3 for now

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Welcome back, {user?.name || "User"}</span>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                    title="Total Inventory"
                    value={totalItems}
                    description="Items in your pantry"
                    icon={Package}
                />
                <SummaryCard
                    title="Expiring Soon"
                    value={expiringSoon}
                    description="Items expiring in 3 days"
                    icon={AlertTriangle}
                />
                <SummaryCard
                    title="Low Stock"
                    value={lowStockItems}
                    description="Items with low quantity"
                    icon={AlertTriangle}
                />
                <SummaryCard
                    title="Recent Logs"
                    value={logs.length}
                    description="Items consumed recently"
                    icon={History}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Your recent food consumption logs.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {logs.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No logs yet. Start tracking your food!</p>
                        ) : (
                            <div className="space-y-4">
                                {logs.slice(0, 5).map((log) => (
                                    <div key={log.id} className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{log.itemName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Consumed {log.quantity} on {new Date(log.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            -{log.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recommended for You</CardTitle>
                        <CardDescription>
                            Sustainable tips based on your inventory.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recommendedResources.map((resource) => (
                                <div key={resource.id} className="flex items-start space-x-4 rounded-md border p-3">
                                    <Leaf className="mt-px h-5 w-5 text-green-500" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{resource.title}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {resource.description}
                                        </p>
                                        <Link href="/resources" className="text-xs text-primary hover:underline">
                                            Read more
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
