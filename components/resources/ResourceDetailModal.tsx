"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Resource } from "@/lib/resourceApi";
import ReactMarkdown from "react-markdown";
import { Calendar, User } from "lucide-react";

interface ResourceDetailModalProps {
  resource: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export function ResourceDetailModal({
  resource,
  open,
  onOpenChange,
}: ResourceDetailModalProps) {
  if (!resource) return null;

  const videoId = resource.video_url
    ? getYouTubeVideoId(resource.video_url)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={resource.type === "video" ? "default" : "secondary"}>
              {resource.type}
            </Badge>
            {resource.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <DialogTitle className="text-2xl">{resource.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-sm pt-2">
            {resource.created_by && (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {resource.created_by.fullName}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(resource.createdAt).toLocaleDateString()}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {resource.type === "video" && videoId ? (
            <div className="mb-6">
              <div className="aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={resource.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
            </div>
          ) : null}

          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{resource.content}</ReactMarkdown>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
