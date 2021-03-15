import create from "zustand";

const useLoadbarStore = create(set => ({
  progress: 0,
  error: false,
  progressTo: number => set({ progress: number, error: false }),
  setToError: bool => set({ error: bool }),
  errorDone: () => {},
  progressDone: () => set({ progress: 0 })
}));

export default useLoadbarStore;
