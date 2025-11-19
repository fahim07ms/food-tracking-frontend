"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { useInventoryStore } from "@/store/useInventoryStore"
import { FoodItem } from "@/types"
import { ImageUpload } from "@/components/shared/image-upload"

const itemSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    category: z.enum(['Fruit', 'Vegetable', 'Dairy', 'Grain', 'Protein', 'Other']),
    quantity: z.coerce.number().min(0, { message: "Quantity must be non-negative" }),
    unit: z.string().min(1, { message: "Unit is required" }),
    expirationDate: z.string().refine((date) => new Date(date) > new Date(), {
        message: "Expiration date must be in the future",
    }),
    costPerUnit: z.coerce.number().min(0, { message: "Cost must be non-negative" }),
})

interface AddEditItemDialogProps {
    itemToEdit?: FoodItem | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddEditItemDialog({ itemToEdit, open, onOpenChange }: AddEditItemDialogProps) {
    const { addItem, updateItem } = useInventoryStore()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof itemSchema>>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            name: "",
            category: "Other",
            quantity: "1",
            unit: "pcs",
            expirationDate: "",
            costPerUnit: "0",
        },
    })

    // Reset form when itemToEdit changes
    useEffect(() => {
        if (itemToEdit) {
            form.reset({
                name: itemToEdit.name,
                category: itemToEdit.category,
                quantity: itemToEdit.quantity.toString(),
                unit: itemToEdit.unit,
                expirationDate: itemToEdit.expirationDate,
                costPerUnit: itemToEdit.costPerUnit.toString(),
            })
        } else {
            form.reset({
                name: "",
                category: "Other",
                quantity: "1",
                unit: "pcs",
                expirationDate: "",
                costPerUnit: "0",
            })
        }
    }, [itemToEdit, form])

    async function onSubmit(values: z.infer<typeof itemSchema>) {
        setIsLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (itemToEdit) {
            updateItem(itemToEdit.id, {
                ...values,
                quantity: values.quantity,
                costPerUnit: values.costPerUnit,
            })
        } else {
            addItem({
                id: Math.random().toString(36).substr(2, 9),
                ...values,
                quantity: values.quantity,
                costPerUnit: values.costPerUnit,
            })
        }

        setIsLoading(false)
        onOpenChange(false)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{itemToEdit ? "Edit Item" : "Add New Item"}</DialogTitle>
                    <DialogDescription>
                        {itemToEdit ? "Update the details of your inventory item." : "Add a new item to your inventory tracking."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Apple" {...field} />
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
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
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" step="0.1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unit</FormLabel>
                                        <FormControl>
                                            <Input placeholder="pcs, kg, etc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="expirationDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expiration Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="costPerUnit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cost per Unit</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <FormLabel>Product Image (Optional)</FormLabel>
                            <ImageUpload onImageSelected={(file) => console.log("File selected:", file.name)} />
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {itemToEdit ? "Save Changes" : "Add Item"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
