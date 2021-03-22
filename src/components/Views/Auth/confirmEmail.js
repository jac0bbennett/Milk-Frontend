import React, { useEffect, useState } from "react";
import { postRequest } from "../../../utils/requests";
import history from "../../../utils/history";
import usePageStore from "../../../stores/usePageStore";
import useLoadbarStore from "../../../stores/useLoadbarStore";

const ConfirmEmail = props => {
  const [msg, setMsg] = useState("Confirming...");

  useEffect(() => {
    usePageStore
      .getState()
      .handlePageChange("Confirming Email", "confirmEmail");
    useLoadbarStore.getState().progressTo(30);

    const req = async () => {
      const resp = await postRequest("/api/verify", {
        confirmCode: props.match.params.confirmcode
      });
      if (resp.error) {
        useLoadbarStore.getState().setToError(true);
        setMsg("Failed to confirm email!");
      } else {
        useLoadbarStore.getState().progressTo(100);
        usePageStore.getState().handleShowModal("msgalert", {
          title: "Email Confirmed!",
          content: "Your account is all setup! Go ahead and Sign In."
        });
        history.push("/panel/signin");
      }
    };

    req();
  }, [props.match.params.confirmcode]);

  return <h2>{msg}</h2>;
};

export default ConfirmEmail;
