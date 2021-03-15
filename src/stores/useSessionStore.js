import create from "zustand";
import { getRequest } from "../utils/requests";
import history from "../utils/history";
import useLoadbarStore from "../stores/useLoadbarStore";

const useSessionStore = create((set, get) => ({
  userId: 0,
  selApp: "0",
  selAppName: "",
  theme: null,
  handleSession: (
    userId = get().userId,
    selApp = get().selApp,
    selAppName = get().selAppName
  ) => {
    set({ userId, selApp, selAppName });
  },
  handleSignIn: userId => {
    set({ userId });
    get().handleGetDefaultTheme();
    history.pushState("/panel/apps");
  },
  handleSignOut: async () => {
    useLoadbarStore.getState().progressTo(15);

    const resp = await getRequest("/api/panel/signout");
    if (resp.error) {
      console.log(resp.error);
      useLoadbarStore.getState().setToError(true);
    } else {
      console.log("signout");
      useLoadbarStore.getState().progressTo(100);
    }
    get().handleSession(0, "0");
    get().handleSetTheme(null);
    history.push("/panel/signin");
  },
  handleSelectApp: async (selApp, selAppName) => {
    set({ selApp, selAppName });
    const resp = await getRequest("/api/panel/apps/select/" + selApp);

    if (resp.error) {
      useLoadbarStore.getState().setToError(true);
      set({ selApp: "0" });
    }
  },
  handleSetTheme: theme => {
    if (theme === "dark") {
      document.body.classList.add("darkmode");
      localStorage.setItem("theme", "dark");
    } else if (theme === "light") {
      document.body.classList.remove("darkmode");
      localStorage.setItem("theme", "light");
    } else {
      localStorage.removeItem("theme");
    }
    set({ theme });
  },
  handleGetDefaultTheme: () => {
    if (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      get().handleSetTheme("dark");
    } else if (localStorage.getItem("theme") === "light") {
      get().handleSetTheme("light");
    }
  }
}));

export default useSessionStore;
