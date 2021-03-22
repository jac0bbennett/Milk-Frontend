import React, { useState, useEffect, useCallback } from "react";
import { statuses } from "../../../../utils/requests";
import usePageStore from "../../../../stores/usePageStore";
import useViewApiCall from "../../../../utils/useViewApiCall";

const SubSuccess = props => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [msg, setMsg] = useState("");
  const [subUrl, setSubUrl] = useState();

  const [respData, respStatus] = useViewApiCall(subUrl);

  const getSubUrl = useCallback(() => {
    const params = new URLSearchParams(props.location.search);
    setSubUrl(
      "/api/panel/subscription/success?session_id=" + params.get("session_id")
    );
  }, [props.location.search]);

  useEffect(() => {
    if (!isLoaded) {
      getSubUrl();
    }
  }, [isLoaded, getSubUrl]);

  useEffect(() => {
    usePageStore
      .getState()
      .handlePageChange("Subscription Success!", "subscriptionSuccess");
    if (respStatus === statuses.SUCCESS) {
      setIsLoaded(true);
      setSuccessful(true);
    } else if (respStatus === statuses.ERROR) {
      setMsg(respData);
    }
  }, [respData, respStatus]);

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
