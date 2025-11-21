"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Leaf, PlayCircle, Sparkles } from "lucide-react";
import { resourceApi, Resource } from "@/lib/resourceApi";
import { ResourceDetailModal } from "@/components/resources/ResourceDetailModal";
import { useAuthStore } from "@/store/authStore";

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [recommendations, setRecommendations] = useState<Resource[]>([]);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        loadResources();
    }, [isAuthenticated]);

    const loadResources = async () => {
        try {
            setLoading(true);
            const [resourcesData, recommendationsData] = await Promise.allSettled([
                resourceApi.getResources({ limit: 50 }),
                isAuthenticated ? resourceApi.getRecommendations() : Promise.resolve(null),
            ]);

            if (resourcesData.status === "fulfilled") {
                setResources(resourcesData.value.resources);
            }

            if (recommendationsData.status === "fulfilled" && recommendationsData.value) {
                setRecommendations(recommendationsData.value.recommendations);
            }
        } catch (error) {
            console.error("Failed to load resources:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResourceClick = (resource: Resource) => {
        setSelectedResource(resource);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-full" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
            </div>

            {isAuthenticated && recommendations.length > 0 && (
                <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <CardTitle>Recommended for You</CardTitle>
                        </div>
                        <CardDescription>
                            Based on your food preferences and inventory
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {recommendations.slice(0, 3).map((resource) => (
                                <Card
                                    key={resource._id}
                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => handleResourceClick(resource)}
                                >
                                    <CardHeader>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge
                                                variant={
                                                    resource.type === "video" ? "default" : "secondary"
                                                }
                                            >
                                                {resource.type === "video" ? (
                                                    <PlayCircle className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <BookOpen className="h-3 w-3 mr-1" />
                                                )}
                                                {resource.type}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-lg line-clamp-2">
                                            {resource.title}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {resource.content.substring(0, 100)}...
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => (
                    <Card
                        key={resource._id}
                        className="flex flex-col cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                        onClick={() => handleResourceClick(resource)}
                    >
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge
                                    variant={resource.type === "video" ? "default" : "secondary"}
                                >
                                    {resource.type === "video" ? (
                                        <PlayCircle className="h-3 w-3 mr-1" />
                                    ) : (
                                        <BookOpen className="h-3 w-3 mr-1" />
                                    )}
                                    {resource.type}
                                </Badge>
                                {resource.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="outline">
                                        {tag}
                                    </Badge>
                                ))}
                                {resource.tags.length > 2 && (
                                    <Badge variant="outline">+{resource.tags.length - 2}</Badge>
                                )}
                            </div>
                            <CardTitle className="text-xl line-clamp-2">
                                {resource.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-3">
                                {resource.content.replace(/[#*_~`]/g, "").substring(0, 150)}...
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto pt-0">
                            <Button className="w-full" variant="secondary">
                                View Resource
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {resources.length === 0 && !loading && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg text-muted-foreground">No resources available yet</p>
                    </CardContent>
                </Card>
            )}

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

            <ResourceDetailModal
                resource={selectedResource}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </div>
    );
}
