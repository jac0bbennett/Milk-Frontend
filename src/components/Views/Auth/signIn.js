import React, { useState, useEffect } from "react";
import { postRequest } from "../../../utils/requests";
import SignInForm from "../../Forms/signIn.js";

const SignIn = props => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const [showResend, setShowResend] = useState(false);

  const resendEmailLink = async () => {
    props.loadbar.progressTo(15);
    setMsg("sending...");

    const formUsername = form.username;

    const req = await postRequest("/api/resendemailconfirmation", {
      username: formUsername
    });

    if (req.error) {
      let reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setMsg("Email Resent!");
      props.loadbar.progressTo(100);
    }
  };

  useEffect(() => {
    props.loadbar.progressTo(15);
    props.page.handlePageChange("Sign In", "signIn");
    props.loadbar.progressTo(100);
  }, [props.loadbar, props.page]);

  const handleSignIn = async () => {
    props.loadbar.progressTo(15);
    setMsg("signing in...");

    const formUsername = form.username;
    const formPass = form.password;

    const req = await postRequest("/api/panel/signin", {
      username: formUsername,
      password: formPass
    });

    if (req.error) {
      const reqMsg = req.error;
      if (reqMsg.includes("confirm")) {
        setShowResend(true);
      }
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      props.loadbar.progressTo(100);
      props.session.handleSignIn(req.userId);
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
      page={props.page}
    />
  );
};

export default SignIn;
