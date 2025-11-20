"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Leaf } from "lucide-react";
import resources from "@/lib/resources.json";

export default function ResourcesPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => (
                    <Card key={resource.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline">{resource.category}</Badge>
                                {resource.type === "Video" && <Badge>Video</Badge>}
                            </div>
                            <CardTitle className="text-xl">{resource.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                {resource.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto pt-0">
                            <Button asChild className="w-full" variant="secondary">
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2"
                                >
                                    Learn More
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-primary" />
                        <CardTitle>Why it matters</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        By reducing food waste and choosing sustainable options, you contribute to
                        SDG 2 (Zero Hunger) and SDG 12 (Responsible Consumption and Production).
                        Every small action counts!
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
