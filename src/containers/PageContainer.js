import { Container } from "unstated";

class PageContainer extends Container {
  // NOTE: Cache data in state for reopen
  // Make modal own container with render function
  state = {
    title: "Home",
    pageId: "",
    showModal: false,
    modalComp: "none",
    modalData: {}
  };

  handlePageChange = (title, pageId) => {
    document.title = "Milk | " + title;
    this.setState({ title: title, pageId: pageId });
  };

  handleShowModal = (comp, data) => {
    this.setState({ showModal: true, modalComp: comp, modalData: data });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };
}

export default PageContainer;
