"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getResourceRecommendations } from "@/lib/analyticsApi";
import { Resource } from "@/lib/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { ResourceDetailModal } from "@/components/resources/ResourceDetailModal";

export function ResourceRecommendations() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const result = await getResourceRecommendations();
                setResources(result.recommendations.slice(0, 4)); // Show max 4
            } catch (err: any) {
                setError(err?.response?.data?.message || "Failed to load recommendations");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleResourceClick = (resource: Resource) => {
        setSelectedResource(resource);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recommended Resources</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-48 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error || resources.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Recommended Resources
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        {error || "No recommendations available at the moment."}
                    </p>
                    <Link href="/resources">
                        <Button variant="outline">Browse All Resources</Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Recommended Resources
                            </CardTitle>
                            <CardDescription>Personalized content to help you achieve your goals</CardDescription>
                        </div>
                        <Link href="/resources">
                            <Button variant="outline" size="sm">
                                View All
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {resources.map((resource) => (
                            <Card
                                key={resource._id}
                                className="h-full hover:shadow-md transition-shadow cursor-pointer flex flex-col"
                                onClick={() => handleResourceClick(resource)}
                            >
                                <CardContent className="p-4 flex flex-col flex-1">
                                    <Badge variant="secondary" className="mb-2 w-fit capitalize">
                                        {resource.type}
                                    </Badge>
                                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                                        {resource.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground line-clamp-3 mb-auto">
                                        {resource.content.substring(0, 150)}...
                                    </p>
                                    {resource.tags && resource.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2 pt-2">
                                            {resource.tags.slice(0, 2).map((tag, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <ResourceDetailModal
                resource={selectedResource}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </>
    );
}
