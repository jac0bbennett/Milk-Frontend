import React, { useEffect, useState } from "react";
import { postRequest } from "../../../utils/requests";
import history from "../../../utils/history";

const ConfirmEmail = props => {
  const [msg, setMsg] = useState("Confirming...");

  useEffect(() => {
    props.page.handlePageChange("Confirming Email", "confirmEmail");
    props.loadbar.progressTo(30);

    const req = async () => {
      const resp = await postRequest("/api/verify", {
        confirmCode: props.match.params.confirmcode
      });
      if (resp.error) {
        props.loadbar.setToError(true);
        setMsg("Failed to confirm email!");
      } else {
        props.loadbar.progressTo(100);
        props.page.handleShowModal("confirmedemailalert");
        history.push("/panel/signin");
      }
    };

    req();
  }, [props.page, props.loadbar, props.match.params.confirmcode]);

  return <h2>{msg}</h2>;
};

export default ConfirmEmail;
