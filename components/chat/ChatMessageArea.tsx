"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "@/lib/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageAreaProps {
    messages: ChatMessage[];
    isLoading?: boolean;
}

export function ChatMessageArea({ messages, isLoading }: ChatMessageAreaProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    if (messages.length === 0 && !isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 bg-muted/40">
                <div className="text-center text-muted-foreground max-w-md">
                    <Bot className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
                    <p className="text-sm">
                        Ask me anything about nutrition, meal planning, or your health goals!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-muted/40 overflow-y-scroll">
            <ScrollArea className="flex-1 px-4 py-6">
                <div className="space-y-4 max-w-3xl mx-auto pb-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            {message.role === "assistant" && (
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                                    <Bot className="h-5 w-5 text-primary-foreground" />
                                </div>
                            )}
                            <div
                                className={`flex flex-col gap-1 max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"
                                    }`}
                            >
                                <div
                                    className={`rounded-lg px-4 py-2 ${message.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-background text-foreground border border-border"
                                        }`}
                                >
                                    {message.role === "assistant" ? (
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="text-sm whitespace-pre-wrap break-words">
                                            {message.content}
                                        </p>
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {format(new Date(message.timestamp), "h:mm a")}
                                </span>
                            </div>
                            {message.role === "user" && (
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                                <Bot className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div className="bg-background border border-border rounded-lg px-4 py-2">
                                <div className="flex gap-1">
                                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
                                    <div
                                        className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"
                                        style={{ animationDelay: "0.1s" }}
                                    />
                                    <div
                                        className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"
                                        style={{ animationDelay: "0.2s" }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={scrollRef} />
                </div>
            </ScrollArea>
        </div>
    );
}
