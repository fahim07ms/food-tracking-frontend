"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { FoodLogCard } from "./FoodLogCard";
import { FoodNutritionModal } from "./FoodNutritionModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FoodLogListProps {
    logs: any[];
    mutate: () => void;
}

export function FoodLogList({ logs, mutate }: FoodLogListProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFoodItem, setSelectedFoodItem] = useState<any>(null);
    const [nutritionModalOpen, setNutritionModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter logs by date or search query
    const filteredLogs = logs.filter((log) => {
        const logDate = new Date(log.date);

        // If searching, search across all logs
        if (searchQuery) {
            const foodName = log.foodItem?.name?.toLowerCase() || "";
            return foodName.includes(searchQuery.toLowerCase());
        }

        // Otherwise, filter by selected date
        if (selectedDate) {
            return (
                logDate.getDate() === selectedDate.getDate() &&
                logDate.getMonth() === selectedDate.getMonth() &&
                logDate.getFullYear() === selectedDate.getFullYear()
            );
        }

        return true;
    });

    // Pagination
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

    // Reset to page 1 when filters change
    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        setSearchQuery("");
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setSelectedDate(undefined);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setSelectedDate(new Date());
        setSearchQuery("");
        setCurrentPage(1);
    };

    const handleCardClick = (log: any) => {
        if (log.foodItem) {
            setSelectedFoodItem(log.foodItem);
            setNutritionModalOpen(true);
        }
    };

    if (!logs || logs.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Food Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        No food logs yet. Start logging your meals!
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Date Picker */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}
                            >
                                <Calendar className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateChange}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>

                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search food items..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-9 pr-9"
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                onClick={() => handleSearchChange("")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Clear Filters */}
                    {(searchQuery || !selectedDate) && (
                        <Button variant="outline" onClick={handleClearFilters}>
                            Clear Filters
                        </Button>
                    )}
                </div>

                {/* Results Info */}
                <div className="text-sm text-muted-foreground">
                    {searchQuery ? (
                        <p>
                            Found {filteredLogs.length} result{filteredLogs.length !== 1 ? "s" : ""} for "{searchQuery}"
                        </p>
                    ) : selectedDate ? (
                        <p>
                            Showing {filteredLogs.length} log{filteredLogs.length !== 1 ? "s" : ""} for {format(selectedDate, "MMMM d, yyyy")}
                        </p>
                    ) : (
                        <p>Showing all {filteredLogs.length} logs</p>
                    )}
                </div>

                {/* Food Log Cards */}
                {paginatedLogs.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No food logs found for the selected filters.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {paginatedLogs.map((log, index) => (
                            <FoodLogCard
                                key={startIndex + index}
                                log={log}
                                index={startIndex + index}
                                onClick={() => handleCardClick(log)}
                                onDelete={mutate}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>

            {/* Nutrition Modal */}
            {selectedFoodItem && (
                <FoodNutritionModal
                    foodItem={selectedFoodItem}
                    open={nutritionModalOpen}
                    onOpenChange={setNutritionModalOpen}
                />
            )}
        </>
    );
}
