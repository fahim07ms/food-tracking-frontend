"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { updateProfileSchema, UpdateProfileInput } from "@/lib/schemas";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export function UserProfileForm({ initialData }: { initialData?: any }) {
    const [isLoading, setIsLoading] = useState(false);
    const updateUser = useAuthStore((state) => state.updateUser);

    const form = useForm<UpdateProfileInput>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            fullName: initialData?.fullName || "",
            currentPassword: "",
            newPassword: "",
        },
    });

    async function onSubmit(data: UpdateProfileInput) {
        setIsLoading(true);
        try {
            // Filter out empty strings
            const payload: any = {};
            if (data.fullName) payload.fullName = data.fullName;
            if (data.newPassword) {
                payload.newPassword = data.newPassword;
                payload.currentPassword = data.currentPassword;
            }

            const response = await api.patch("/user/profile", payload);
            if (payload.fullName) {
                updateUser({ fullName: response.data.user.fullName });
            }
            toast.success("Profile updated successfully");
            form.reset({
                fullName: response.data.user.fullName,
                currentPassword: "",
                newPassword: "",
            });
        } catch (error: any) {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Failed to update profile",
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                    Update your name and password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4 pt-4 border-t">
                            <h4 className="text-sm font-medium">
                                Change Password
                            </h4>
                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="******"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Required only if changing password
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="******"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Update Account
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
