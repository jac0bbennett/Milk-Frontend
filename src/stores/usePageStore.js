import create from "zustand";

const usePageStore = create((set, get) => ({
  title: "",
  pageId: "",
  refreshView: 0,
  showModal: false,
  modalComp: "none",
  modalData: {},
  persistentModalData: {},
  handlePageChange: (title, pageId) => {
    document.title = title + " | Milk";
    set({ title: title, pageId: pageId });
  },
  handleShowModal: (
    comp = get().modalComp,
    data = {},
    persistentData = get().persistentModalData
  ) =>
    set({
      showModal: true,
      modalComp: comp,
      modalData: data,
      persistentModalData: persistentData
    }),
  handleCloseModal: () => {
    set({ showModal: false });
    if (
      "callbackOnClose" in get().modalData &&
      get().modalData.callbackOnClose
    ) {
      get().modalData.callback(null);
    }
  },
  handleUpdateModalData: newData => {
    set({ modalData: newData });
  },
  handleUpdatePersistentModalData: newData => {
    set({ persistentModalData: newData });
  },
  handleSetRefresh: () => set(state => ({ refreshView: state.refreshView + 1 }))
}));

export default usePageStore;
