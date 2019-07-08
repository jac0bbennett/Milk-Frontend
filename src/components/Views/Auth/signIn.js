import React, { useState, useEffect } from "react";
import { postRequest } from "../../../utils/requests";
import SignInForm from "../../Forms/signIn.js";

const SignIn = props => {
  const [form, setForm] = useState({ pseudo: "", key: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    props.loadbar.progressTo(15);
    props.page.handlePageChange("Sign In", "signIn");
    props.loadbar.progressTo(100);
  }, [props.loadbar, props.page]);

  const handleSignIn = async () => {
    props.loadbar.progressTo(15);
    setMsg("signing in...");

    const formPseudo = form.pseudo;
    const formKey = form.key;

    const req = await postRequest("/api/panel/signin", {
      pseudo: formPseudo,
      key: formKey
    });

    if (req.error) {
      const reqMsg = req.error;
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
    />
  );
};

export default SignIn;
