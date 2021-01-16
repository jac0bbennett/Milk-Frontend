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
import { Provider, Subscribe } from "unstated";
import SessionContainer from "./containers/SessionContainer";
import LoadbarContainer from "./containers/LoadbarContainer";
import PageContainer from "./containers/PageContainer";
// import UNSTATED from "unstated-debug";

// UNSTATED.logStateChanges = true;

const sessionCont = new SessionContainer();
const loadbarCont = new LoadbarContainer();

sessionCont.bindLoadbar(loadbarCont);

const App = () => {
  useEffect(() => {
    sessionCont.handleGetDefaultTheme();
  }, []);

  return (
    <Provider inject={[sessionCont, loadbarCont]}>
      <Subscribe to={[SessionContainer, LoadbarContainer, PageContainer]}>
        {(session, loadbar, page) => (
          <React.Fragment>
            <div id="overlay" className={page.state.showModal ? "is-show" : ""}>
              <Cloak isShow={page.state.showModal} page={page} />
              <Modal
                isShow={page.state.showModal}
                inner={page.state.modalComp}
                loadbar={loadbar}
                page={page}
                session={session}
              />
            </div>
            <LoadingBar
              id="loadingbar"
              progress={loadbar.state.progress}
              onErrorDone={loadbar.errorDone}
              onProgressDone={loadbar.progressDone}
              error={loadbar.state.error}
            />
            <TopBar session={session} page={page} />
            <div id="wrapper">
              <Switch>
                <Route
                  exact
                  path="/panel/apps"
                  render={props => (
                    <AppList
                      {...props}
                      loadbar={loadbar}
                      page={page}
                      session={session}
                    />
                  )}
                />
                <Route
                  exact
                  path="/panel/apps/:appuuid/apikeys"
                  render={props => (
                    <AppApiKeys
                      {...props}
                      loadbar={loadbar}
                      page={page}
                      session={session}
                    />
                  )}
                />
                <Route
                  exact
                  path={"/panel/apps/:appuuid/types"}
                  render={props => (
                    <ContentTypeList
                      {...props}
                      loadbar={loadbar}
                      page={page}
                      session={session}
                    />
                  )}
                />
                <Route
                  exact
                  path={"/panel/apps/:appuuid/types/:typeslug"}
                  render={props => (
                    <EditContentType
                      {...props}
                      loadbar={loadbar}
                      page={page}
                      session={session}
                    />
                  )}
                />
                <Route
                  exact
                  path={"/panel/apps/:appuuid/content"}
                  render={props => (
                    <ContentList
                      {...props}
                      loadbar={loadbar}
                      page={page}
                      session={session}
                    />
                  )}
                />
                <Route
                  exact
                  path={"/panel/apps/:appuuid"}
                  render={props => <AppPage {...props} />}
                />
                <Route
                  exact
                  path={"/panel/apps/:appuuid/content/:contentuuid"}
                  render={props => (
                    <EditContent
                      {...props}
                      loadbar={loadbar}
                      page={page}
                      session={session}
                    />
                  )}
                />
                <Route
                  exact
                  path={"/panel/apps/:appuuid/assets"}
                  render={props => (
                    <AssetList
                      {...props}
                      loadbar={loadbar}
                      page={page}
                      session={session}
                    />
                  )}
                />
                <Route
                  exact
                  path="/panel/signin"
                  render={props => (
                    <SignIn
                      {...props}
                      loadbar={loadbar}
                      page={page}
                      session={session}
                    />
                  )}
                />
                <Route
                  exact
                  path="/panel/signup"
                  render={props => (
                    <SignUp
                      {...props}
                      loadbar={loadbar}
                      page={page}
                      session={session}
                    />
                  )}
                />
                <Route
                  exact
                  path="/panel/signout"
                  render={props => (
                    <SignOut
                      {...props}
                      loadbar={loadbar}
                      page={page}
                      session={session}
                    />
                  )}
                />
                <Route
                  exact
                  path="/verify/:confirmcode"
                  render={props => (
                    <ConfirmEmail
                      {...props}
                      loadbar={loadbar}
                      page={page}
                      session={session}
                    />
                  )}
                />
                <Route
                  exact
                  path="/resetpassword/:token"
                  render={props => (
                    <ResetPassword
                      {...props}
                      loadbar={loadbar}
                      page={page}
                      session={session}
                    />
                  )}
                />
                <Route
                  exact
                  path="/panel/account"
                  render={props => (
                    <UserSettings
                      {...props}
                      loadbar={loadbar}
                      page={page}
                      session={session}
                    />
                  )}
                />
                <Route
                  exact
                  path="/panel/subscription/success"
                  render={props => (
                    <SubSuccess
                      {...props}
                      loadbar={loadbar}
                      page={page}
                      session={session}
                    />
                  )}
                />
                <Route
                  path="*"
                  exact={true}
                  render={() => (
                    <React.Fragment>404 Page Not Found!</React.Fragment>
                  )}
                />
              </Switch>
            </div>
          </React.Fragment>
        )}
      </Subscribe>
    </Provider>
  );
};

export default App;
