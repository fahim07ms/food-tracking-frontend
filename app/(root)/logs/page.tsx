"use client"

import { useState } from "react"
import { Plus, Calendar } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useConsumptionStore } from "@/store/useConsumptionStore"
import { LogFoodDialog } from "@/components/consumption/log-food-dialog"

export default function LogsPage() {
    const { logs } = useConsumptionStore()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Consumption Logs</h3>
                    <p className="text-sm text-muted-foreground">
                        Track your daily food usage and reduce waste.
                    </p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Log Food
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Quantity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No logs yet. Start tracking!
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        {format(new Date(log.date), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="font-medium">{log.itemName}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{log.category}</Badge>
                                    </TableCell>
                                    <TableCell>{log.quantity}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <LogFoodDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </div>
    )
}
