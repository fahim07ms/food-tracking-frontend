import { create } from "zustand";

interface InventoryState {
    currentInventoryId: string | null;
    setCurrentInventoryId: (id: string) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
    currentInventoryId: null,
    setCurrentInventoryId: (id: string) => set({ currentInventoryId: id }),
}));
