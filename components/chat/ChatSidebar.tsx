"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatSession } from "@/lib/types/chat";
import { formatDistanceToNow } from "date-fns";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChatSidebarProps {
    sessions: ChatSession[];
    currentSessionId: string | null;
    onSelectSession: (sessionId: string) => void;
    onDeleteSession: (sessionId: string) => void;
    onNewChat: () => void;
}

export function ChatSidebar({
    sessions,
    currentSessionId,
    onSelectSession,
    onDeleteSession,
    onNewChat,
}: ChatSidebarProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

    const handleDeleteClick = (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSessionToDelete(sessionId);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (sessionToDelete) {
            onDeleteSession(sessionToDelete);
            setSessionToDelete(null);
        }
        setDeleteDialogOpen(false);
    };

    // Sort sessions by updatedAt (most recent first)
    const sortedSessions = [...sessions].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return (
        <>
            <div className="w-full md:w-90 border-r border-r-chart-5/50 bg-background flex flex-col h-full overflow-y-scroll">
                <div className="p-4 border-b border-b-chart-5/50">
                    <Button
                        onClick={onNewChat}
                        className="w-full justify-start gap-2"
                        variant="default"
                    >
                        <Plus className="h-4 w-4" />
                        New Chat
                    </Button>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {sortedSessions.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8 px-4">
                                <p className="text-sm">No chat sessions yet</p>
                                <p className="text-xs mt-1">Click "New Chat" to start</p>
                            </div>
                        ) : (
                            sortedSessions.map((session) => (
                                <div
                                    key={session._id}
                                    className={`group relative flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${currentSessionId === session._id
                                        ? "bg-muted text-foreground"
                                        : "hover:bg-muted/50 text-muted-foreground"
                                        }`}
                                    onClick={() => onSelectSession(session._id)}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {session.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(session.updatedAt), {
                                                addSuffix: true,
                                            })}
                                        </p>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => handleDeleteClick(session._id, e)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Chat Session</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this chat session? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
