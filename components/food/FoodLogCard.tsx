"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Clock, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import api from "@/lib/api";

interface FoodLogCardProps {
    log: any;
    index: number;
    onClick: () => void;
    onDelete: () => void;
}

export function FoodLogCard({ log, index, onClick, onDelete }: FoodLogCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    async function handleDelete(e: React.MouseEvent) {
        e.stopPropagation();
        setIsDeleting(true);
        try {
            await api.delete(`/user/food-logs/${index}`);
            toast.success("Food log deleted");
            setDeleteDialogOpen(false);
            onDelete();
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to delete food log");
        } finally {
            setIsDeleting(false);
        }
    }

    const foodItem = log.foodItem;
    const logDate = new Date(log.date);

    return (
        <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={onClick}
        >
            <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Left: Food Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                            {/* Food Image Thumbnail */}
                            {foodItem?.image_url ? (
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                    <img
                                        src={foodItem.image_url}
                                        alt={foodItem.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                    <span className="text-lg font-semibold text-muted-foreground">
                                        {foodItem?.name?.charAt(0)?.toUpperCase() || "?"}
                                    </span>
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base truncate">
                                    {foodItem?.name || "Unknown Food"}
                                </h3>
                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {log.time}
                                    </span>
                                    <span>•</span>
                                    <span>{log.quantity} serving{log.quantity !== 1 ? "s" : ""}</span>
                                    {foodItem && (
                                        <>
                                            <span>•</span>
                                            <span>{foodItem.calories * log.quantity} kcal</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Date & Actions */}
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="hidden sm:flex">
                            {format(logDate, "MMM d")}
                        </Badge>

                        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Food Log</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this food log entry? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
