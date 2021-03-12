import React from "react";
import TextInput from "../UI/Inputs/txtInput";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";
import Recaptcha from "react-recaptcha";

const SignUpForm = props => {
  const verifyCaptcha = resp => {
    props.handleCaptcha(resp);
  };

  return (
    <form id="signin" onSubmit={props.handleSubmit}>
      <h1>Sign Up</h1>
      <TextInput
        name="name"
        onChange={e => props.handleChange(e)}
        type="text"
        label="Name"
        autoComplete="name"
        required={true}
        value={props.form.name}
      />
      <TextInput
        name="email"
        onChange={e => props.handleChange(e)}
        type="email"
        label="Email"
        autoComplete="email"
        required={true}
        value={props.form.email}
      />
      <TextInput
        name="password"
        onChange={e => props.handleChange(e)}
        type="password"
        label="Password"
        required={true}
        autoComplete="new-password"
        value={props.form.password}
      />
      <Recaptcha
        sitekey="6LeWBXwaAAAAAHdk_jirfG2fiqjGLTKu0RTcsFtT"
        verifyCallback={verifyCaptcha}
      />
      <br />
      <FormMsg msg={props.msg} />
      <SubmitButton>Sign Up</SubmitButton>
      <br />
      <br />
    </form>
  );
};

export default SignUpForm;
