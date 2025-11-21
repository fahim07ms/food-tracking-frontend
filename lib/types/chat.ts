export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export interface ChatSession {
    _id: string;
    title: string;
    systemInstruction?: string;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}

// API Response Types
export interface GetChatSessionsResponse {
    chatSessions: ChatSession[];
}

export interface GetChatSessionResponse {
    chatSession: ChatSession;
}

export interface CreateChatSessionResponse {
    message: string;
    chatSession: ChatSession;
}

export interface SendChatMessageResponse {
    message: string;
    userMessage: ChatMessage;
    aiMessage: ChatMessage;
    chatSession: ChatSession;
}

export interface DeleteChatSessionResponse {
    message: string;
    deleted: ChatSession;
}
