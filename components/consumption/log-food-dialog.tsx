"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useConsumptionStore } from "@/store/useConsumptionStore"
import { useInventoryStore } from "@/store/useInventoryStore"
// import { ImageUpload } from "@/components/shared/image-upload"

const logSchema = z.object({
    itemId: z.string().optional(),
    itemName: z.string().min(2, { message: "Item name is required" }),
    quantity: z.coerce.number().min(0.1, { message: "Quantity must be greater than 0" }),
    category: z.string().min(1, { message: "Category is required" }),
    date: z.string().min(1, { message: "Date is required" }),
})

interface LogFoodDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function LogFoodDialog({ open, onOpenChange }: LogFoodDialogProps) {
    const { addLog } = useConsumptionStore()
    const { items, updateItem } = useInventoryStore()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof logSchema>>({
        resolver: zodResolver(logSchema),
        defaultValues: {
            itemName: "",
            quantity: "1",
            category: "",
            date: new Date().toISOString().split('T')[0],
        },
    })

    // Handle item selection from inventory
    const handleItemSelect = (itemId: string) => {
        const item = items.find(i => i.id === itemId)
        if (item) {
            form.setValue("itemName", item.name)
            form.setValue("category", item.category)
            form.setValue("itemId", item.id)
        }
    }

    async function onSubmit(values: z.infer<typeof logSchema>) {
        setIsLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        addLog({
            id: Math.random().toString(36).substr(2, 9),
            itemId: values.itemId || "",
            itemName: values.itemName,
            quantity: values.quantity,
            category: values.category,
            date: values.date,
        })

        // If linked to inventory item, reduce quantity
        if (values.itemId) {
            const item = items.find(i => i.id === values.itemId)
            if (item) {
                const newQuantity = Math.max(0, item.quantity - values.quantity)
                updateItem(item.id, { quantity: newQuantity })
            }
        }

        setIsLoading(false)
        onOpenChange(false)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Log Consumption</DialogTitle>
                    <DialogDescription>
                        Record what you've used. Select from inventory or enter manually.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="itemId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select from Inventory (Optional)</FormLabel>
                                    <Select onValueChange={handleItemSelect}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select item..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {items.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    {item.name} ({item.quantity} {item.unit})
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
                            name="itemName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Apple" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity Used</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" step="0.1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Fruit">Fruit</SelectItem>
                                                <SelectItem value="Vegetable">Vegetable</SelectItem>
                                                <SelectItem value="Dairy">Dairy</SelectItem>
                                                <SelectItem value="Grain">Grain</SelectItem>
                                                <SelectItem value="Protein">Protein</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Log Item
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
