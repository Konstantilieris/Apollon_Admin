import { getConstant } from "@/lib/actions/constant.action";
import { create } from "zustand";
interface ConstantStoreProps {
  foods: any;
  behaviors: any;
  breeds: any;
  loading: boolean;
  error: string | null;
  fetchConstants: () => Promise<void>;
}

const useStore = create<ConstantStoreProps>((set) => ({
  foods: [],
  behaviors: [],
  breeds: [],
  loading: true,
  error: null,

  fetchConstants: async () => {
    set({ loading: true, error: null });
    try {
      const [foods, behaviors, breeds] = await Promise.all([
        getConstant("Foods"),
        getConstant("Behaviors"),
        getConstant("Breeds"),
      ]);
      set({ foods, behaviors, breeds, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useStore;
