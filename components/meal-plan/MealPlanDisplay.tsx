"use client";

import { MealPlan, NutritionalGoal } from "@/lib/types/mealPlan";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, UtensilsCrossed, Lightbulb } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface MealPlanDisplayProps {
    mealPlan: MealPlan | null;
    goal?: NutritionalGoal;
    budget?: number;
}

export function MealPlanDisplay({ mealPlan, goal, budget }: MealPlanDisplayProps) {
    if (!mealPlan) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <UtensilsCrossed className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Meal Plan Generated</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                        Generate your first AI-powered meal plan using the form above. The plan will be based on your inventory and nutritional goals.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const isBudgetExceeded = budget && mealPlan.totalPrice > budget;

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text("AI Generated Meal Plan", 14, 20);

        // Add generation date
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

        // Add nutritional goals if available
        if (goal) {
            doc.setFontSize(12);
            doc.text("Nutritional Goals:", 14, 38);
            doc.setFontSize(10);
            doc.text(`Calories: ${goal.calories} kcal | Protein: ${goal.protein}g | Carbs: ${goal.carbohydrate}g`, 14, 44);
            doc.text(`Fat: ${goal.fat_total}g | Fiber: ${goal.fiber}g`, 14, 50);
        }

        // Add meal plan table
        const tableData = mealPlan.items.map((item) => [
            item.time_to_eat,
            item.foodItemName,
            item.quantity.toString(),
            `৳${item.price.toFixed(2)}`,
        ]);

        autoTable(doc, {
            startY: goal ? 56 : 36,
            head: [["Time", "Food Name", "Quantity", "Price (BDT)"]],
            body: tableData,
            foot: [["", "", "Total:", `৳${mealPlan.totalPrice.toFixed(2)}`]],
            theme: "grid",
            headStyles: { fillColor: [59, 130, 246] },
            footStyles: { fillColor: [243, 244, 246], textColor: [0, 0, 0], fontStyle: "bold" },
        });

        // Add suggestions if available
        if (mealPlan.suggestions) {
            const finalY = (doc as any).lastAutoTable.finalY || 56;
            doc.setFontSize(12);
            doc.text("AI Suggestions:", 14, finalY + 10);
            doc.setFontSize(10);
            const splitText = doc.splitTextToSize(mealPlan.suggestions, 180);
            doc.text(splitText, 14, finalY + 16);
        }

        // Save PDF
        doc.save(`meal-plan-${new Date().toISOString().split("T")[0]}.pdf`);
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Your Meal Plan</CardTitle>
                            <CardDescription>AI-generated based on your inventory and goals</CardDescription>
                        </div>
                        <Button onClick={handleDownloadPDF} variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Food Name</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Price (BDT)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mealPlan.items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.time_to_eat}</TableCell>
                                    <TableCell>{item.foodItemName}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">৳{item.price.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="mt-4 flex justify-end">
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total Price</p>
                            <p
                                className={`text-2xl font-bold ${isBudgetExceeded ? "text-destructive" : "text-foreground"
                                    }`}
                            >
                                ৳{mealPlan.totalPrice.toFixed(2)} BDT
                            </p>
                            {isBudgetExceeded && (
                                <p className="text-sm text-destructive mt-1">
                                    Exceeds budget by ৳{(mealPlan.totalPrice - budget).toFixed(2)}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {mealPlan.suggestions && (
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            AI Suggestions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{mealPlan.suggestions}</p>
                    </CardContent>
                </Card>
            )}

            {goal && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Nutritional Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Calories</p>
                                <p className="text-lg font-semibold">{goal.calories} kcal</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Protein</p>
                                <p className="text-lg font-semibold">{goal.protein}g</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Carbs</p>
                                <p className="text-lg font-semibold">{goal.carbohydrate}g</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Fat</p>
                                <p className="text-lg font-semibold">{goal.fat_total}g</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Fiber</p>
                                <p className="text-lg font-semibold">{goal.fiber}g</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
