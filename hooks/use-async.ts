import { useEffect, useState } from "react";
export function useAsync<T>(fn: () => Promise<T>) {
  const [state, set] = useState<{
    data?: T;
    loading: boolean;
    error?: unknown;
  }>({ loading: true });

  useEffect(() => {
    let mounted = true;
    fn()
      .then((data) => mounted && set({ data, loading: false }))
      .catch((error) => mounted && set({ error, loading: false }));
    return () => {
      mounted = false;
    };
  }, [fn]);

  return state;
}
