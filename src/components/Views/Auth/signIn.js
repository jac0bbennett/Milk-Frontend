import React, { useState, useEffect } from "react";
import { postRequest } from "../../../utils/requests";
import SignInForm from "../../Forms/signIn.js";
import useLoadbarStore from "../../../stores/useLoadbarStore";
import usePageStore from "../../../stores/usePageStore";
import useSessionStore from "../../../stores/useSessionStore";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const resendEmailLink = async () => {
    useLoadbarStore.getState().progressTo(15);
    setMsg("sending...");

    const formEmail = form.email;

    const req = await postRequest("/api/resendemailconfirmation", {
      email: formEmail
    });

    if (req.error) {
      let reqMsg = req.error;
      setMsg(reqMsg);
      useLoadbarStore.getState().setToError(true);
    } else {
      setMsg("Email Resent!");
      useLoadbarStore.getState().progressTo(100);
    }
  };

  useEffect(() => {
    useLoadbarStore.getState().progressTo(15);
    usePageStore.getState().handlePageChange("Sign In", "signIn");
    useLoadbarStore.getState().progressTo(100);
  }, []);

  const handleSignIn = async () => {
    useLoadbarStore.getState().progressTo(15);
    setSubmitting(true);

    const formEmail = form.email;
    const formPass = form.password;

    const req = await postRequest("/api/panel/signin", {
      email: formEmail,
      password: formPass
    });

    if (req.error) {
      const reqMsg = req.error;
      if (reqMsg.includes("confirm")) {
        setShowResend(true);
      }
      setMsg(reqMsg);
      useLoadbarStore.getState().setToError(true);
      setSubmitting(false);
    } else {
      useLoadbarStore.getState().progressTo(100);
      useSessionStore.getState().handleSignIn(req.userId);
    }
  };

  const handleChange = event => {
    let formCopy = { ...form };
    formCopy[event.target.name] = event.target.value;
    setForm(formCopy);
    setMsg("");
    setShowResend(false);
  };

  const handleSubmit = event => {
    event.preventDefault();
    handleSignIn();
  };

  return (
    <SignInForm
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      form={form}
      msg={msg}
      showResend={showResend}
      resendEmailLink={resendEmailLink}
      submitting={submitting}
    />
  );
};

export default SignIn;
