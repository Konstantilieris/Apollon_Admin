import { create } from "zustand";
export enum STAGE_ENUM {
  "INITIAL",
  "STATS",
  "FEES",
  "OVERVIEW",
}
interface ClientCardState {
  stage: STAGE_ENUM;
  setStage: (stage: STAGE_ENUM) => void;
}
export const useClientCard = create<ClientCardState>((set) => ({
  stage: STAGE_ENUM.INITIAL,
  setStage: (stage) => set({ stage }),
}));
