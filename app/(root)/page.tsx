"use client";

import useSWR from "swr";
import { Activity, Flame, Target, Utensils, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { format } from "date-fns";

// Fetcher function for SWR
const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { data, error, isLoading } = useSWR("/user/me", fetcher);

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
                Failed to load dashboard data
            </div>
        );
    }

    const userData = data?.user;
    const today = format(new Date(), "yyyy-MM-dd");

    // Filter logs for today
    const todayLogs =
        userData?.foodLogs?.filter((log: any) => {
            const logDate = new Date(log.date).toISOString().split("T")[0];
            return logDate === today;
        }) || [];

    // Calculate totals (Mock calculation as we need food item details)
    // In a real app, we would need to populate food items or sum them up on the backend
    // For now, we'll just count items
    const totalItems = todayLogs.length;

    // Get current goal
    const currentGoal = userData?.goals?.[userData?.current_goal_index || 0];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <span className="text-muted-foreground">
                    {format(new Date(), "EEEE, MMMM do, yyyy")}
                </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Calories (Est.)
                        </CardTitle>
                        <Flame className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">
                            / {currentGoal ? "2000" : "--"} kcal target
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Items Logged
                        </CardTitle>
                        <Utensils className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalItems}</div>
                        <p className="text-xs text-muted-foreground">Today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Current Weight
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {userData?.healthProfile?.current_weight_kg || "--"}{" "}
                            kg
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Target: {currentGoal?.target_weight_kg || "--"} kg
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Goal
                        </CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">
                            {currentGoal?.primary_goals?.[0]?.replace(
                                "_",
                                " ",
                            ) || "None"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Active Goal
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {todayLogs.length > 0 ? (
                            <div className="space-y-4">
                                {todayLogs.map((log: any, i: number) => (
                                    <div key={i} className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                Food Item ID: {log.foodItem}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {log.time} - {log.quantity}{" "}
                                                portion(s)
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            {/* Calories would go here */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No food logged today.
                            </p>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {/* We can add quick add buttons here later */}
                        <p className="text-sm text-muted-foreground">
                            Shortcuts coming soon.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
