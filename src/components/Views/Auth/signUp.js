import React, { useState, useEffect } from "react";
import { postRequest } from "../../../utils/requests";
import SignUpForm from "../../Forms/signUp.js";
import history from "../../../utils/history";

const SignUp = props => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
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

    const formName = form.name;
    const formEmail = form.email;
    const formPass = form.password;

    const req = await postRequest("/api/panel/signup", {
      name: formName,
      email: formEmail,
      password: formPass,
      captcha: captcha
    });

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      props.loadbar.progressTo(100);
      props.page.handleShowModal("msgalert", {
        title: "Email Confirmation Sent",
        content:
          "An email has been sent to " +
          formEmail +
          ". Please confirm it to finish setting up your account."
      });
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
