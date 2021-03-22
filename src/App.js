import React, { useEffect } from "react";
import TopBar from "./components/UI/TopBar/topBar";
import { Switch, Route } from "react-router-dom";
import LoadingBar from "./components/UI/LoadingBar/loadingBar";
import SignIn from "./components/Views/Auth/signIn";
import SignUp from "./components/Views/Auth/signUp";
import SignOut from "./components/Views/Auth/signOut";
import AppList from "./components/Views/Apps/appList";
import AppApiKeys from "./components/Views/Apps/appApiKeys";
import AppPage from "./components/Views/Apps/appPage";
import ContentTypeList from "./components/Views/ContentTypes/typeList";
import EditContentType from "./components/Views/ContentTypes/editType";
import ContentList from "./components/Views/Content/contentList";
import EditContent from "./components/Views/Content/editContent";
import AssetList from "./components/Views/Assets/assetList";
import UserSettings from "./components/Views/User/settings";
import SubSuccess from "./components/Views/User/Subscription/subSuccess";
import ConfirmEmail from "./components/Views/Auth/confirmEmail";
import ResetPassword from "./components/Views/Auth/resetPassword";
import { Modal } from "./components/UI/Modal/modal";
import Cloak from "./components/UI/Modal/cloak";
import usePageStore from "./stores/usePageStore";
import useLoadbarStore from "./stores/useLoadbarStore";
import useSessionStore from "./stores/useSessionStore";

const App = () => {
  const showModal = usePageStore(state => state.showModal);
  const {
    loadbarProgress,
    loadbarOnErrorDone,
    loadbarOnProgressDone,
    loadbarError
  } = useLoadbarStore(state => ({
    loadbarProgress: state.progress,
    loadbarOnErrorDone: state.errorDone,
    loadbarOnProgressDone: state.progressDone,
    loadbarError: state.error
  }));

  useEffect(() => {
    useSessionStore.getState().handleGetDefaultTheme();
  }, []);

  return (
    <React.Fragment>
      <div id="overlay" className={showModal ? "is-show" : ""}>
        <Cloak />
        <Modal />
      </div>
      <LoadingBar
        id="loadingbar"
        progress={loadbarProgress}
        onErrorDone={loadbarOnErrorDone}
        onProgressDone={loadbarOnProgressDone}
        error={loadbarError}
      />
      <TopBar />
      <div id="wrapper">
        <Switch>
          <Route
            exact
            path="/panel/apps"
            render={props => <AppList {...props} />}
          />
          <Route
            exact
            path="/panel/apps/:appuuid/apikeys"
            render={props => <AppApiKeys {...props} />}
          />
          <Route
            exact
            path={"/panel/apps/:appuuid/types"}
            render={props => <ContentTypeList {...props} />}
          />
          <Route
            exact
            path={"/panel/apps/:appuuid/types/:typeslug"}
            render={props => <EditContentType {...props} />}
          />
          <Route
            exact
            path={"/panel/apps/:appuuid/content"}
            render={props => <ContentList {...props} />}
          />
          <Route
            exact
            path={"/panel/apps/:appuuid"}
            render={props => <AppPage {...props} />}
          />
          <Route
            exact
            path={"/panel/apps/:appuuid/content/:contentuuid"}
            render={props => <EditContent {...props} />}
          />
          <Route
            exact
            path={"/panel/apps/:appuuid/assets"}
            render={props => <AssetList {...props} />}
          />
          <Route
            exact
            path="/panel/signin"
            render={props => <SignIn {...props} />}
          />
          <Route
            exact
            path="/panel/signup"
            render={props => <SignUp {...props} />}
          />
          <Route
            exact
            path="/panel/signout"
            render={props => <SignOut {...props} />}
          />
          <Route
            exact
            path="/verify/:confirmcode"
            render={props => <ConfirmEmail {...props} />}
          />
          <Route
            exact
            path="/resetpassword/:token"
            render={props => <ResetPassword {...props} />}
          />
          <Route
            exact
            path="/panel/account"
            render={props => <UserSettings {...props} />}
          />
          <Route
            exact
            path="/panel/subscription/success"
            render={props => <SubSuccess {...props} />}
          />
          <Route
            path="*"
            exact={true}
            render={() => <React.Fragment>404 Page Not Found!</React.Fragment>}
          />
        </Switch>
      </div>
    </React.Fragment>
  );
};

export default App;
