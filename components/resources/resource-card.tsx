import { ExternalLink, Leaf, PlayCircle, BookOpen } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Resource } from "@/types"

interface ResourceCardProps {
    resource: Resource
    isRecommended?: boolean
}

export function ResourceCard({ resource, isRecommended }: ResourceCardProps) {
    const Icon = resource.type === 'Video' ? PlayCircle : resource.type === 'Article' ? BookOpen : Leaf

    return (
        <Card className={`flex flex-col ${isRecommended ? 'border-primary/50 bg-primary/5' : ''}`}>
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <Badge variant={isRecommended ? "default" : "secondary"}>
                            {resource.category}
                        </Badge>
                    </div>
                    {isRecommended && (
                        <Badge variant="outline" className="border-primary text-primary">
                            Recommended
                        </Badge>
                    )}
                </div>
                <CardTitle className="mt-2 line-clamp-2 text-lg">{resource.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                    {resource.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                {/* Content spacer */}
            </CardContent>
            <CardFooter>
                {resource.url ? (
                    <Button variant="outline" className="w-full gap-2" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            View Resource <ExternalLink className="h-4 w-4" />
                        </a>
                    </Button>
                ) : (
                    <Button variant="secondary" className="w-full" disabled>
                        Read Tip
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
