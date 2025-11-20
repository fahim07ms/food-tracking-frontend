"use client";

import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { GoalList } from "@/components/goals/GoalList";
import { GoalForm } from "@/components/goals/GoalForm";
import api from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function GoalsPage() {
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
                Failed to load goals
            </div>
        );
    }

    const user = data?.user;
    const goals = user?.goals || [];
    const currentGoalIndex = user?.current_goal_index;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
                <GoalForm onSuccess={mutate} />
            </div>

            <GoalList
                goals={goals}
                currentGoalIndex={currentGoalIndex}
                mutate={mutate}
            />
        </div>
    );
}
