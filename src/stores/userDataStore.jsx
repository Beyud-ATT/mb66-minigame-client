import { create } from "zustand";

const useUserDataStore = create((set) => ({
  userData: null,
  actions: {
    setUserData: (userData) => set({ userData }),
    removeUserData: () => set({ userData: null }),
  },
}));

export const useUserData = () => useUserDataStore((state) => state.userData);

export const useUserDataActions = () =>
  useUserDataStore((state) => state.actions);
