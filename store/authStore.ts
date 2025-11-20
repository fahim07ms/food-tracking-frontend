import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    id: string;
    fullName: string;
    email: string;
    image_url?: string;
    healthProfile?: {
        birth_date?: string;
        gender?: string;
        height_cm?: number;
        current_weight_kg?: number;
        [key: string]: any;
    };
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (user) => set({ user, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false }),
            updateUser: (updates) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null,
                })),
        }),
        {
            name: "auth-storage",
        }
    )
);
