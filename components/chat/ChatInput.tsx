"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading?: boolean;
    placeholder?: string;
}

export function ChatInput({
    onSendMessage,
    isLoading = false,
    placeholder = "Type your message...",
}: ChatInputProps) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message.trim());
            setMessage("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border-t border-border p-4 bg-background">
            <div className="flex gap-2 max-w-3xl mx-auto">
                <Textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={isLoading}
                    className="min-h-[60px] max-h-[200px] resize-none"
                    rows={1}
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={!message.trim() || isLoading}
                    className="h-[60px] w-[60px] flex-shrink-0"
                >
                    <Send className="h-5 w-5" />
                </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
                Press Enter to send, Shift+Enter for new line
            </p>
        </form>
    );
}
