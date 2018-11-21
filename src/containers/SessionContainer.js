import history from "../utils/history";
import { getRequest } from "../utils/requests";
import { Container } from "unstated";

class SessionContainer extends Container {
  state = {
    userId: 0,
    selApp: "0",
    selAppName: ""
  };

  handleSession = (
    userId = this.state.userId,
    selApp = this.state.selApp,
    selAppName = this.state.selAppName
  ) => {
    if (selApp !== "0") {
      this.handleSelectApp(selApp, selAppName);
    }
    this.setState({ userId, selApp, selAppName });
  };

  handleSignIn = userId => {
    this.setState({ userId });
    history.push("/panel/apps");
  };

  handleSignOut = async () => {
    this.loadbar.progressTo(15);
    const resp = await getRequest("/api/panel/signout");
    if (resp.error) {
      console.log(resp.error);
      this.loadbar.setToError(true);
    } else {
      console.log("signout");
      this.loadbar.progressTo(100);
    }
    history.push("/panel/signin");
    this.handleSession(0, "0");
  };

  handleSelectApp = async selApp => {
    this.setState({ selApp });

    const appreq = await getRequest("/api/panel/apps/" + selApp);
    if (appreq.data.name) {
      this.setState({ selAppName: appreq.data.name });
    }

    const resp = await getRequest("/api/panel/apps/select/" + selApp);

    if (resp.error) {
      this.loadbar.setToError(true);
      this.setState({ selApp: "0" });
    }
  };

  bindLoadbar = loadbar => {
    this.loadbar = loadbar;
  };
}

export default SessionContainer;