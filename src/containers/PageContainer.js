import { Container } from "unstated";

class PageContainer extends Container {
  // NOTE: Cache data in state for reopen
  state = {
    title: "Home",
    pageId: "",
    refreshView: false,
    showModal: false,
    modalComp: "none",
    modalData: {}
  };

  handlePageChange = (title, pageId) => {
    document.title = "Milk | " + title;
    this.setState({ title: title, pageId: pageId });
  };

  handleShowModal = (
    comp = this.state.modalComp,
    data = this.state.modalData,
    reset = false
  ) => {
    if (reset) {
      this.setState({ modalComp: "none" });
    }
    this.setState({ showModal: true, modalComp: comp, modalData: data });
    //document.body.style.overflowY = "hidden";
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
    //document.body.style.overflowY = "scroll";
  };

  handleSetRefresh = bool => {
    this.setState({ refreshView: bool });
  };
}

export default PageContainer;
