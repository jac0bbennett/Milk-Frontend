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
        name="pseudo"
        onChange={e => props.handleChange(e)}
        type="text"
        label="Pseudonym"
        autoComplete="username"
        required={true}
        value={props.form.pseudo}
      />
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
        type="text"
        label="Email"
        autoComplete="email"
        required={true}
        value={props.form.email}
      />
      <TextInput
        name="key"
        onChange={e => props.handleChange(e)}
        type="password"
        label="Key"
        required={true}
        autoComplete="new-password"
        value={props.form.key}
      />
      <TextInput
        name="confirmKey"
        onChange={e => props.handleChange(e)}
        type="password"
        label="Confirm Key"
        required={true}
        autoComplete="new-password"
        value={props.form.confirmKey}
      />
      <Recaptcha
        sitekey="6LdmgKwUAAAAAHtAd7q4tR4BwjYYhf_Vk7MYndPb"
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
