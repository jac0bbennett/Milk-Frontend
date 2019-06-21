import React, { useState, useEffect, useReducer } from "react";
import { postRequest } from "../../../utils/requests";
import SignUpForm from "../../Forms/signUp.js";
import history from "../../../utils/history";

const SignUp = props => {
  const [form, setForm] = useState({
    pseudo: "",
    name: "",
    email: "",
    key: "",
    confirmKey: ""
  });
  const [msg, setMsg] = useState("");

  const handleSignUp = async () => {
    props.loadbar.progressTo(15);
    setMsg("submitting...");

    const formPseudo = form.pseudo;
    const formName = form.name;
    const formEmail = form.email;
    const formKey = form.key;
    const formConfirmKey = form.confirmKey;

    const req = await postRequest("/api/panel/signup", {
      pseudo: formPseudo,
      name: formName,
      email: formEmail,
      key: formKey,
      confirmKey: formConfirmKey
    });

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setSignUp({ type: "authenticated", userId: req.userId });
    }
  };

  const signUpReducer = (state, action) => {
    switch (action.type) {
      case "initPage":
        props.loadbar.progressTo(15);
        props.page.handlePageChange("Sign Up", "signUp");
        props.loadbar.progressTo(100);
        return state;
      case "signUp":
        handleSignUp();
        return state;
      case "completed":
        return { completed: true, userId: action.userId };
      case "completeSignIn":
        props.loadbar.progressTo(100);
        history.push("/panel/signin");
        return state;
      default:
        return state;
    }
  };

  const [signUp, setSignUp] = useReducer(signUpReducer, {
    completed: false
  });

  useEffect(() => {
    setSignUp({ type: "initPage" });
  }, []);

  useEffect(() => {
    if (signUp.completed) {
      setSignUp({ type: "completeSignUp" });
    }
  }, [signUp]);

  const handleChange = event => {
    let formCopy = { ...form };
    formCopy[event.target.name] = event.target.value;
    setForm(formCopy);
    setMsg("");
  };

  const handleSubmit = event => {
    event.preventDefault();
    setSignUp({ type: "signUp" });
  };

  return (
    <SignUpForm
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      form={form}
      msg={msg}
    />
  );
};

export default SignUp;
