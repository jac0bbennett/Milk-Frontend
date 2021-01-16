import React, { useState, useEffect } from "react";
import { getRequest } from "../../../../utils/requests";

const SubSuccess = props => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    props.page.handlePageChange("Subscription Success!", "subscriptionSuccess");
    const params = new URLSearchParams(props.location.search);
    const req = async () => {
      const resp = await getRequest(
        "/api/panel/subscription/success?session_id=" + params.get("session_id")
      );

      if (resp.error) {
        props.loadbar.setToError(true);
        setIsLoaded(true);
        setSuccessful(false);
        setMsg(resp.error);
      } else {
        const userId = resp.meta.userId;
        const selApp = resp.meta.appUUID;
        setIsLoaded(true);
        setSuccessful(true);
        props.session.handleSession(userId, selApp);
        props.loadbar.progressTo(100);
      }
    };
    props.loadbar.progressTo(15);
    req();
  }, [props.loadbar, props.location.search, props.page, props.session]);

  return (
    <React.Fragment>
      {isLoaded ? (
        successful ? (
          <div>
            <h1>Subscription Started!</h1>
            <span>Your account has been upgraded to premium!</span>
          </div>
        ) : (
          <h3>{msg}</h3>
        )
      ) : (
        <div>
          <h3>Checking...</h3>
        </div>
      )}
    </React.Fragment>
  );
};

export default SubSuccess;
