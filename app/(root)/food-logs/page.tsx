"use client";

import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { FoodLogList } from "@/components/food/FoodLogList";
import { AddFoodLogForm } from "@/components/food/AddFoodLogForm";
import api from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function FoodLogsPage() {
    const { data, error, isLoading, mutate } = useSWR("/user/me", fetcher);

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
                Failed to load food logs
            </div>
        );
    }

    const user = data?.user;
    const foodLogs = user?.foodLogs || [];

    // Sort logs by date/time descending (newest first)
    const sortedLogs = [...foodLogs].sort((a: any, b: any) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) {
            return dateB - dateA;
        }
        return b.time.localeCompare(a.time);
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Food Logs</h1>
                <AddFoodLogForm onSuccess={mutate} />
            </div>

            <FoodLogList logs={sortedLogs} mutate={mutate} />
        </div>
    );
}
