import history from "../../../utils/history";

const AppPage = props => {
  history.push("/panel/apps/" + props.match.params.appuuid + "/content");

  return null;
};

export default AppPage;
