import api from "./api";
import {
    ChatSession,
    CreateChatSessionResponse,
    DeleteChatSessionResponse,
    GetChatSessionResponse,
    GetChatSessionsResponse,
    SendChatMessageResponse,
} from "./types/chat";

const CHAT_BASE_URL = "/user/chat-sessions";

/**
 * Get all chat sessions for the current user
 */
export const getChatSessions = async (): Promise<ChatSession[]> => {
    const response = await api.get<GetChatSessionsResponse>(CHAT_BASE_URL);
    return response.data.chatSessions;
};

/**
 * Get a specific chat session by ID
 */
export const getChatSession = async (sessionId: string): Promise<ChatSession> => {
    const response = await api.get<GetChatSessionResponse>(`${CHAT_BASE_URL}/${sessionId}`);
    return response.data.chatSession;
};

/**
 * Create a new chat session
 */
export const createChatSession = async (
    title: string,
    systemInstruction?: string
): Promise<ChatSession> => {
    const response = await api.post<CreateChatSessionResponse>(CHAT_BASE_URL, {
        title,
        systemInstruction,
    });
    return response.data.chatSession;
};

/**
 * Send a message in a chat session and receive AI response
 */
export const sendChatMessage = async (
    sessionId: string,
    message: string
): Promise<SendChatMessageResponse> => {
    const response = await api.post<SendChatMessageResponse>(
        `${CHAT_BASE_URL}/${sessionId}/message`,
        { message }
    );
    return response.data;
};

/**
 * Delete a chat session
 */
export const deleteChatSession = async (sessionId: string): Promise<void> => {
    await api.delete<DeleteChatSessionResponse>(`${CHAT_BASE_URL}/${sessionId}`);
};
