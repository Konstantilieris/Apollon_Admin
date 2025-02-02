import { create } from "zustand";
interface ServiceClientStoreState {
  clientId: string;
  setClientId: (clientId: string) => void;
  resetStore: () => void;
}

export const useServiceClientStore = create<ServiceClientStoreState>((set) => ({
  clientId: "",
  setClientId: (clientId) => set({ clientId }),
  resetStore: () => set({ clientId: "" }),
}));
export default useServiceClientStore;
