import { Container } from "unstated";

class PageContainer extends Container {
  state = { title: "Home", pageId: "" };

  handlePageChange = (title, pageId) => {
    document.title = "Milk | " + title;
    this.setState({ title: title, pageId: pageId });
  };
}

export default PageContainer;
