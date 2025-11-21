import { create } from "zustand";
import { ChatSession } from "@/lib/types/chat";

interface ChatState {
    sessions: ChatSession[];
    currentSessionId: string | null;
    isLoading: boolean;
    setSessions: (sessions: ChatSession[]) => void;
    setCurrentSession: (sessionId: string | null) => void;
    addSession: (session: ChatSession) => void;
    updateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
    removeSession: (sessionId: string) => void;
    addMessageToSession: (sessionId: string, message: { role: "user" | "assistant"; content: string; timestamp: Date }) => void;
    setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    sessions: [],
    currentSessionId: null,
    isLoading: false,

    setSessions: (sessions) => set({ sessions }),

    setCurrentSession: (sessionId) => set({ currentSessionId: sessionId }),

    addSession: (session) =>
        set((state) => ({
            sessions: [session, ...state.sessions],
        })),

    updateSession: (sessionId, updates) =>
        set((state) => ({
            sessions: state.sessions.map((session) =>
                session._id === sessionId
                    ? { ...session, ...updates, updatedAt: new Date() }
                    : session
            ),
        })),

    removeSession: (sessionId) =>
        set((state) => ({
            sessions: state.sessions.filter((session) => session._id !== sessionId),
            currentSessionId:
                state.currentSessionId === sessionId
                    ? state.sessions.find((s) => s._id !== sessionId)?._id || null
                    : state.currentSessionId,
        })),

    addMessageToSession: (sessionId, message) =>
        set((state) => ({
            sessions: state.sessions.map((session) =>
                session._id === sessionId
                    ? {
                        ...session,
                        messages: [...session.messages, message],
                        updatedAt: new Date(),
                    }
                    : session
            ),
        })),

    setLoading: (loading) => set({ isLoading: loading }),
}));
