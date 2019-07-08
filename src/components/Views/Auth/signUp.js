import React, { useState, useEffect } from "react";
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
  const [captcha, setCaptcha] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    props.loadbar.progressTo(15);
    props.page.handlePageChange("Sign Up", "signUp");
    props.loadbar.progressTo(100);
  }, [props.loadbar, props.page]);

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
      confirmKey: formConfirmKey,
      captcha: captcha
    });

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      props.loadbar.progressTo(100);
      history.push("/panel/signin");
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
    handleSignUp();
  };

  const handleCaptcha = resp => {
    setCaptcha(resp);
  };

  return (
    <SignUpForm
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleCaptcha={handleCaptcha}
      form={form}
      msg={msg}
    />
  );
};

export default SignUp;
