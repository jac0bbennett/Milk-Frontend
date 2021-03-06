import React, { useState, useEffect } from "react";
import { postRequest } from "../../../utils/requests";
import { NewPasswordForm } from "../../Forms/resetPassword.js";
import history from "../../../utils/history";
import usePageStore from "../../../stores/usePageStore";
import useLoadbarStore from "../../../stores/useLoadbarStore";

const ResetPassword = props => {
  const [form, setForm] = useState({ password: "" });
  const [msg, setMsg] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    useLoadbarStore.getState().progressTo(15);
    usePageStore.getState().handlePageChange("Reset Password", "resetPassword");
    useLoadbarStore.getState().progressTo(100);
  }, []);

  const handleUpdate = async () => {
    useLoadbarStore.getState().progressTo(15);
    setUpdating(true);

    const formPass = form.password;
    const token = props.match.params.token;

    const req = await postRequest("/api/resetpassword/change", {
      password: formPass,
      token: token
    });

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      useLoadbarStore.getState().setToError(true);
    } else {
      useLoadbarStore.getState().progressTo(100);
      usePageStore.getState().handleShowModal("msgalert", {
        title: "Password Updated!",
        content: "Now sign in to your account with your new password."
      });
      history.push("/panel/signin");
    }
    setUpdating(false);
  };

  const handleChange = event => {
    let formCopy = { ...form };
    formCopy[event.target.name] = event.target.value;
    setForm(formCopy);
    setMsg("");
  };

  const handleSubmit = event => {
    event.preventDefault();
    handleUpdate();
  };

  return (
    <NewPasswordForm
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      form={form}
      msg={msg}
      updating={updating}
    />
  );
};

export default ResetPassword;
