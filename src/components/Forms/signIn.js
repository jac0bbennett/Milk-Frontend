import React from "react";
import TextInput from "../UI/Inputs/txtInput";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";

const SignInForm = props => {
  return (
    <form id="signin" onSubmit={props.handleSubmit}>
      <h1>Sign In</h1>
      <TextInput
        name="username"
        onChange={e => props.handleChange(e)}
        type="text"
        label="Username"
        autoComplete={"username"}
        required={true}
        value={props.form.username}
      />
      <TextInput
        name="password"
        onChange={e => props.handleChange(e)}
        type="password"
        label="Password"
        required={true}
        autoComplete={"current-password"}
        value={props.form.password}
      />
      <br />
      <br />
      <FormMsg msg={props.msg} />
      <SubmitButton>Sign In</SubmitButton>
      <br />
      <br />
    </form>
  );
};

export default SignInForm;
