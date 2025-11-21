"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface NewChatDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateChat: (firstMessage: string) => Promise<void>;
}

export function NewChatDialog({ open, onOpenChange, onCreateChat }: NewChatDialogProps) {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsLoading(true);
        try {
            await onCreateChat(message.trim());
            setMessage("");
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to create chat:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Start New Chat</DialogTitle>
                    <DialogDescription>
                        Type your first message to start a new conversation. The chat title will be
                        generated automatically.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="message">Your message</Label>
                            <Textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="E.g., What are some healthy breakfast options?"
                                className="min-h-[100px]"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!message.trim() || isLoading}>
                            {isLoading ? "Creating..." : "Start Chat"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
