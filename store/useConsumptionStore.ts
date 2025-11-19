import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConsumptionLog } from '@/types';

interface ConsumptionState {
    logs: ConsumptionLog[];
    addLog: (log: ConsumptionLog) => void;
}

export const useConsumptionStore = create<ConsumptionState>()(
    persist(
        (set) => ({
            logs: [],
            addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
        }),
        {
            name: 'food-tracking-consumption',
        }
    )
);
