"use client"

import { useState } from "react"
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useInventoryStore } from "@/store/useInventoryStore"
import { AddEditItemDialog } from "@/components/inventory/add-edit-item-dialog"
import { FoodItem } from "@/types"

export default function InventoryPage() {
    const { items, removeItem } = useInventoryStore()
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("All")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [itemToEdit, setItemToEdit] = useState<FoodItem | null>(null)

    const filteredItems = items.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "All" || item.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    const handleEdit = (item: FoodItem) => {
        setItemToEdit(item)
        setIsDialogOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            removeItem(id)
        }
    }

    const handleAddNew = () => {
        setItemToEdit(null)
        setIsDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Inventory</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your food items and track expiration dates.
                    </p>
                </div>
                <Button onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Categories</SelectItem>
                        <SelectItem value="Fruit">Fruit</SelectItem>
                        <SelectItem value="Vegetable">Vegetable</SelectItem>
                        <SelectItem value="Dairy">Dairy</SelectItem>
                        <SelectItem value="Grain">Grain</SelectItem>
                        <SelectItem value="Protein">Protein</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Expiration</TableHead>
                            <TableHead>Cost</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No items found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{item.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {item.quantity} {item.unit}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(item.expirationDate), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell>${item.costPerUnit.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <AddEditItemDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                itemToEdit={itemToEdit}
            />
        </div>
    )
}
