"use client";

import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { HealthProfileForm } from "@/components/profile/HealthProfileForm";
import { UserProfileForm } from "@/components/profile/UserProfileForm";
import api from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function ProfilePage() {
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
                Failed to load profile data
            </div>
        );
    }

    const user = data?.user;

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            </div>

            <div className="grid gap-6">
                <UserProfileForm initialData={user} />
                <HealthProfileForm initialData={user?.healthProfile} />
            </div>
        </div>
    );
}
