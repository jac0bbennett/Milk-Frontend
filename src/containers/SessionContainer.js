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
    this.handleSetTheme("light");
  };

  handleSelectApp = async selApp => {
    this.setState({ selApp });

    const resp = await getRequest("/api/panel/apps/select/" + selApp);

    if (resp.error) {
      this.loadbar.setToError(true);
      this.setState({ selApp: "0" });
    } else {
      this.setState({ selAppName: resp.name });
    }
  };

  handleSetTheme = theme => {
    if (theme === "dark") {
      document.body.style.background = "#242424";
      document.body.style.color = "#ffffff";

      document.getElementById("root").classList.add("darkmode");

      localStorage.setItem("theme", "dark");
    } else {
      document.body.style.background = null;
      document.body.style.color = null;

      document.getElementById("root").classList.remove("darkmode");

      localStorage.setItem("theme", "light");
    }

    this.setState({ theme });
  };

  bindLoadbar = loadbar => {
    this.loadbar = loadbar;
  };
}

export default SessionContainer;
