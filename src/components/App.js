import React from "react";
import TopBar from "./topBar";
import { Switch, Route } from "react-router-dom";
import LoadingBar from "./loadingBar";
import SignIn from "../containers/signIn";
import SignOut from "../containers/signOut";
import AppList from "../containers/appList";
import { Provider, Subscribe } from "unstated";
import SessionContainer from "../containers/SessionContainer";
import LoadbarContainer from "../containers/LoadbarContainer";
import PageContainer from "../containers/PageContainer";
import UNSTATED from "unstated-debug";

UNSTATED.logStateChanges = true;

const sessionCont = new SessionContainer();
const loadbarCont = new LoadbarContainer();
const pageCont = new PageContainer();

sessionCont.bindLoadbar(loadbarCont);

const App = props => {
  return (
    <Provider inject={[sessionCont, loadbarCont, pageCont]}>
      <Subscribe to={[SessionContainer, LoadbarContainer, PageContainer]}>
        {(session, loadbar, page) => (
          <React.Fragment>
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
