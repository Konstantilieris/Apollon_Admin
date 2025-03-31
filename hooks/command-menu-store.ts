/* eslint-disable no-unused-vars */
import { create } from "zustand";

export enum CommandMenuType {
  Professions = "Professions",
  Foods = "Foods",
  Behaviors = "Behaviors",
  Breeds = "Breeds",
  Tags = "Tags",
}

interface CommandMenuState {
  menuType: CommandMenuType;
  disableOthers: boolean;
  setDisableOthers: (disableOthers: boolean) => void;
  values: string[];
  fieldValue: string;
  setFieldValue: (fieldValue: string) => void;
  loading: boolean;
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  setLoading: (loading: boolean) => void;
  setValues: (values: string[]) => void;
  editValue: string | null;
  setEditValue: (value: string | null) => void;
  deleteValue: string | null;
  setDeleteValue: (value: string | null) => void;
  setMenuType: (menuType: CommandMenuType) => void;
  isForm?: boolean;
  setIsForm: (isForm: boolean) => void;
  isCreate: boolean;
  setIsCreate: (isCreate: boolean) => void;
  resetAllValues: () => void;
}

export const useCommandMenuStore = create<CommandMenuState>((set) => ({
  menuType: CommandMenuType.Professions,
  values: [],
  fieldValue: "",
  isCreate: false,
  setIsCreate: (isCreate) => set({ isCreate }),
  setFieldValue: (fieldValue) => set({ fieldValue }),
  loading: false,
  searchValue: "",
  disableOthers: false,
  setDisableOthers: (disableOthers) => set({ disableOthers }),
  setSearchValue: (searchValue) => set({ searchValue }),
  setLoading: (loading) => set({ loading }),
  setValues: (values) => set({ values }),
  setMenuType: (menuType) => set({ menuType }),
  editValue: null,
  setEditValue: (editValue) => set({ editValue }),
  deleteValue: null,
  setDeleteValue: (deleteValue) => set({ deleteValue }),
  isForm: false,
  setIsForm: (isForm) => set({ isForm }),
  resetAllValues: () =>
    set({
      fieldValue: "",
      searchValue: "",
      editValue: null,
      deleteValue: null,
      isCreate: false,
    }),
}));
