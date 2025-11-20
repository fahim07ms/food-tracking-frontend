"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { addFoodLogSchema, AddFoodLogInput } from "@/lib/schemas";
import api from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function AddFoodLogForm({ onSuccess }: { onSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch user's inventory to get food items
    const { data: inventoryData } = useSWR("/inventory", fetcher);

    // Extract food items from user's inventory
    const foodItems = inventoryData?.inventory?.foodItems || [];

    const form = useForm<AddFoodLogInput>({
        resolver: zodResolver(addFoodLogSchema),
        defaultValues: {
            date: new Date(),
            time: new Date().toTimeString().slice(0, 5),
            quantity: 1,
            foodItemId: "",
        },
    });

    async function onSubmit(data: AddFoodLogInput) {
        setIsLoading(true);
        try {
            await api.post("/user/food-logs", data);
            toast.success("Food log added");
            setOpen(false);
            form.reset({
                date: new Date(),
                time: new Date().toTimeString().slice(0, 5),
                quantity: 1,
                foodItemId: "",
            });
            onSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to add food log");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Log Food
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Food Log</DialogTitle>
                    <DialogDescription>
                        Record what you ate today.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                >
                                                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="foodItemId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Food Item</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select food" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {foodItems.map((item: any) => (
                                                <SelectItem key={item._id} value={item._id}>
                                                    {item.name} ({item.calories} kcal)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity (Servings)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.5"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Log
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
