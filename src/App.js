import React from "react";
import TopBar from "./components/UI/TopBar/topBar";
import { Switch, Route } from "react-router-dom";
import LoadingBar from "./components/UI/LoadingBar/loadingBar";
import SignIn from "./components/Views/Auth/signIn";
import SignOut from "./components/Views/Auth/signOut";
import AppList from "./components/Views/AppList/appList";
import ContentTypeList from "./components/Views/ContentTypes/typeList";
import EditContentType from "./components/Views/ContentTypes/editType";
import ContentList from "./components/Views/Content/contentList";
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
const pageCont = new PageContainer();

sessionCont.bindLoadbar(loadbarCont);

const App = () => {
  return (
    <Provider inject={[sessionCont, loadbarCont, pageCont]}>
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
            <TopBar page={page} session={session} />
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
                  path="/panel/signout"
                  render={props => (
                    <SignOut
                      {...props}
                      loadbar={loadbar}
                      onSignOut={session.handleSignOut}
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
