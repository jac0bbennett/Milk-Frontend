import React, { useState, useEffect, useReducer } from "react";
import { postRequest } from "../../../utils/requests";
import SignInForm from "../../Forms/signIn.js";

const SignIn = props => {
  const [form, setForm] = useState({ pseudo: "", key: "" });
  const [msg, setMsg] = useState("");

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
      setSignIn({ type: "authenticated", userId: req.userId });
    }
  };

  const signInReducer = (state, action) => {
    switch (action.type) {
      case "initPage":
        props.loadbar.progressTo(15);
        props.page.handlePageChange("Sign In", "signIn");
        props.loadbar.progressTo(100);
        return state;
      case "signIn":
        handleSignIn();
        return state;
      case "authenticated":
        return { authenticated: true, userId: action.userId };
      case "completeSignIn":
        props.loadbar.progressTo(100);
        props.session.handleSignIn(state.userId);
        return state;
      default:
        return state;
    }
  };

  const [signIn, setSignIn] = useReducer(signInReducer, {
    authenticated: false
  });

  useEffect(() => {
    setSignIn({ type: "initPage" });
  }, []);

  useEffect(() => {
    if (signIn.authenticated) {
      setSignIn({ type: "completeSignIn" });
    }
  }, [signIn]);

  const handleChange = event => {
    let formCopy = { ...form };
    formCopy[event.target.name] = event.target.value;
    setForm(formCopy);
    setMsg("");
  };

  const handleSubmit = event => {
    event.preventDefault();
    setSignIn({ type: "signIn" });
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
