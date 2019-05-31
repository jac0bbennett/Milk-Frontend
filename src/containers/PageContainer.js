import { Container } from "unstated";

class PageContainer extends Container {
  // NOTE: Cache data in state for reopen
  state = {
    title: "",
    pageId: "",
    refreshView: 0,
    showModal: false,
    modalComp: "none",
    modalData: {}
  };

  handlePageChange = (title, pageId) => {
    document.title = title + " | Milk";
    this.setState({ title: title, pageId: pageId });
  };

  handleShowModal = (
    comp = this.state.modalComp,
    data = this.state.modalData
  ) => {
    this.setState({ showModal: true, modalComp: comp, modalData: data });
    //document.body.style.overflowY = "hidden";
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
    //document.body.style.overflowY = "scroll";
  };

  handleSetRefresh = () => {
    this.setState({ refreshView: this.state.refreshView + 1 });
  };
}

export default PageContainer;
