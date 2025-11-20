"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfileSchema, UpdateProfileInput } from "@/lib/schemas";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export function UserProfileForm({ initialData }: { initialData?: any }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [profileImage, setProfileImage] = useState(initialData?.image_url || "");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const updateUser = useAuthStore((state) => state.updateUser);

    const form = useForm<UpdateProfileInput>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            fullName: initialData?.fullName || "",
            currentPassword: "",
            newPassword: "",
        },
    });

    async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        setIsUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await api.patch("/user/profile-image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setProfileImage(response.data.image_url);
            updateUser({ image_url: response.data.image_url });
            toast.success("Profile picture updated successfully");
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to upload image");
        } finally {
            setIsUploadingImage(false);
        }
    }

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
                newPassword: ""
            });
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update profile");
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
                {/* Profile Picture Section */}
                <div className="flex items-center gap-6 pb-6 border-b mb-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={profileImage} alt={initialData?.fullName || "User"} />
                        <AvatarFallback className="text-2xl">
                            {initialData?.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h4 className="text-sm font-medium mb-2">Profile Picture</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            Upload a profile picture (max 5MB)
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingImage}
                        >
                            {isUploadingImage ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Image
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4 pt-4 border-t">
                            <h4 className="text-sm font-medium">Change Password</h4>
                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="******" {...field} />
                                        </FormControl>
                                        <FormDescription>Required only if changing password</FormDescription>
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
                                            <Input type="password" placeholder="******" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Account
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
