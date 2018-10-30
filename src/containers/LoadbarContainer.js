import { Container } from "unstated";

class LoadbarContainer extends Container {
  state = { progress: 0, error: false };

  progressTo = number => {
    const error = false;
    const progress = number;
    this.setState({ progress, error });
  };

  setToError = bool => {
    const error = bool;
    this.setState({ error: error });
  };

  errorDone = () => {
    // Callback
    // console.log("Error Finished!");
    // const loadBar = { ...this.state.loadBar };
    // loadBar.error = false;
    // this.setState({ loadBar });
  };

  progressDone = () => {
    // Callback
    const progress = 0;
    this.setState({ progress });
  };
}

export default LoadbarContainer;
