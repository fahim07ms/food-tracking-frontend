"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Trash2, CheckCircle2 } from "lucide-react";
import { getInventoryExpirationCheck } from "@/lib/analyticsApi";
import { InventoryExpirationCheck } from "@/lib/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function InventoryExpirationCard() {
    const [data, setData] = useState<InventoryExpirationCheck | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const result = await getInventoryExpirationCheck();
                setData(result);
            } catch (err: any) {
                setError(err?.response?.data?.message || "Failed to load expiration data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Inventory Expiration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Inventory Expiration</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Link href="/inventory">
                        <Button className="mt-4" variant="outline">
                            Go to Inventory
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    if (!data) return null;

    const { summary, warning, wasted } = data;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Inventory Expiration
                </CardTitle>
                <CardDescription>Track food freshness and reduce waste</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-green-600">{summary.healthyCount}</p>
                        <p className="text-xs text-muted-foreground">Healthy</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-yellow-600">{summary.warningCount}</p>
                        <p className="text-xs text-muted-foreground">Warning</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <Trash2 className="h-5 w-5 text-red-600 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-red-600">{summary.wastedCount}</p>
                        <p className="text-xs text-muted-foreground">Wasted</p>
                    </div>
                </div>

                {/* Warning Items */}
                {warning.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            Items Expiring Soon
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {warning.slice(0, 5).map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-2 rounded-md bg-yellow-500/5 border border-yellow-500/20"
                                >
                                    <div className="flex items-center gap-2">
                                        {item.foodItem.image_url && (
                                            <img
                                                src={item.foodItem.image_url}
                                                alt={item.foodItem.name}
                                                className="h-8 w-8 rounded object-cover"
                                            />
                                        )}
                                        <span className="text-sm font-medium">{item.foodItem.name}</span>
                                    </div>
                                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                        {item.hoursRemaining.toFixed(1)}h left
                                    </Badge>
                                </div>
                            ))}
                            {warning.length > 5 && (
                                <p className="text-xs text-muted-foreground text-center">
                                    +{warning.length - 5} more items
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Wasted Items */}
                {wasted.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Trash2 className="h-4 w-4 text-red-600" />
                            Expired Items
                        </h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {wasted.slice(0, 3).map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-2 rounded-md bg-red-500/5 border border-red-500/20"
                                >
                                    <div className="flex items-center gap-2">
                                        {item.foodItem.image_url && (
                                            <img
                                                src={item.foodItem.image_url}
                                                alt={item.foodItem.name}
                                                className="h-8 w-8 rounded object-cover"
                                            />
                                        )}
                                        <span className="text-sm font-medium">{item.foodItem.name}</span>
                                    </div>
                                    <Badge variant="outline" className="text-red-600 border-red-600">
                                        Expired
                                    </Badge>
                                </div>
                            ))}
                            {wasted.length > 3 && (
                                <p className="text-xs text-muted-foreground text-center">
                                    +{wasted.length - 3} more items
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {warning.length === 0 && wasted.length === 0 && summary.healthyCount > 0 && (
                    <div className="text-center py-4">
                        <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">All items are fresh!</p>
                        <p className="text-xs text-muted-foreground">Great job managing your inventory</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
