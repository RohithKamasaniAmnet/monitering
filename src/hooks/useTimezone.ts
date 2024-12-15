import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimezoneStore {
  timezone: 'CST' | 'IST';
  toggleTimezone: () => void;
}

export const useTimezone = create<TimezoneStore>()(
  persist(
    (set) => ({
      timezone: 'CST',
      toggleTimezone: () => set((state) => ({ 
        timezone: state.timezone === 'CST' ? 'IST' : 'CST' 
      })),
    }),
    {
      name: 'timezone-storage',
    }
  )
);