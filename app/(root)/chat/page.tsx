"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useChatStore } from "@/store/chatStore";
import { getChatSessions, createChatSession, sendChatMessage, deleteChatSession } from "@/lib/chatApi";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatMessageArea } from "@/components/chat/ChatMessageArea";
import { ChatInput } from "@/components/chat/ChatInput";
import { NewChatDialog } from "@/components/chat/NewChatDialog";

export default function ChatPage() {
    const router = useRouter();
    const {
        sessions,
        currentSessionId,
        isLoading,
        setSessions,
        setCurrentSession,
        addSession,
        removeSession,
        addMessageToSession,
        setLoading,
    } = useChatStore();

    const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
    const [isSendingMessage, setIsSendingMessage] = useState(false);

    // Fetch chat sessions on mount
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setLoading(true);
                const fetchedSessions = await getChatSessions();
                setSessions(fetchedSessions);

                // Auto-navigate to the most recent session
                if (fetchedSessions.length > 0 && !currentSessionId) {
                    const mostRecent = fetchedSessions.sort(
                        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                    )[0];
                    setCurrentSession(mostRecent._id);
                }
            } catch (error) {
                console.error("Failed to fetch chat sessions:", error);
                toast.error("Failed to load chat sessions");
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const handleNewChat = () => {
        setNewChatDialogOpen(true);
    };

    const handleCreateChat = async (firstMessage: string) => {
        try {
            // Generate title from first message (first 50 chars)
            const title = firstMessage.length > 50
                ? firstMessage.substring(0, 50) + "..."
                : firstMessage;

            // Create the session
            const newSession = await createChatSession(title);
            addSession(newSession);
            setCurrentSession(newSession._id);

            // Send the first message
            setIsSendingMessage(true);
            const response = await sendChatMessage(newSession._id, firstMessage);

            // Update session with messages
            addMessageToSession(newSession._id, response.userMessage);
            addMessageToSession(newSession._id, response.aiMessage);

            toast.success("Chat created successfully");
        } catch (error) {
            console.error("Failed to create chat:", error);
            toast.error("Failed to create chat");
            throw error;
        } finally {
            setIsSendingMessage(false);
        }
    };

    const handleSendMessage = async (message: string) => {
        if (!currentSessionId) {
            toast.error("No chat session selected");
            return;
        }

        try {
            setIsSendingMessage(true);

            // Optimistic update - add user message immediately
            addMessageToSession(currentSessionId, {
                role: "user",
                content: message,
                timestamp: new Date(),
            });

            // Send message to backend
            const response = await sendChatMessage(currentSessionId, message);

            // Add AI response
            addMessageToSession(currentSessionId, response.aiMessage);
        } catch (error) {
            console.error("Failed to send message:", error);
            toast.error("Failed to send message");
        } finally {
            setIsSendingMessage(false);
        }
    };

    const handleDeleteSession = async (sessionId: string) => {
        try {
            await deleteChatSession(sessionId);
            removeSession(sessionId);
            toast.success("Chat deleted successfully");
        } catch (error) {
            console.error("Failed to delete session:", error);
            toast.error("Failed to delete chat");
        }
    };

    const currentSession = sessions.find((s) => s._id === currentSessionId);

    return (
        <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-60px)] overflow-hidden">
            <ChatSidebar
                sessions={sessions}
                currentSessionId={currentSessionId}
                onSelectSession={setCurrentSession}
                onDeleteSession={handleDeleteSession}
                onNewChat={handleNewChat}
            />

            <div className="flex-1 flex flex-col">
                {currentSession ? (
                    <>
                        <div className="border-b border-b-chart-5/50 p-4 bg-background">
                            <h2 className="font-semibold text-lg truncate">{currentSession.title}</h2>
                        </div>
                        <ChatMessageArea
                            messages={currentSession.messages}
                            isLoading={isSendingMessage}
                        />
                        <ChatInput
                            onSendMessage={handleSendMessage}
                            isLoading={isSendingMessage}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center p-8 bg-muted/40">
                        <div className="text-center text-muted-foreground max-w-md">
                            <h3 className="text-lg font-semibold mb-2">No Chat Selected</h3>
                            <p className="text-sm mb-4">
                                Select a chat from the sidebar or start a new conversation
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <NewChatDialog
                open={newChatDialogOpen}
                onOpenChange={setNewChatDialogOpen}
                onCreateChat={handleCreateChat}
            />
        </div>
    );
}
