import React from "react";
import TextInput from "../UI/Inputs/txtInput";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";

const SignInForm = props => {
  return (
    <form id="signin" onSubmit={props.handleSubmit}>
      <h1>Sign In</h1>
      <TextInput
        name="pseudo"
        onChange={e => props.handleChange(e)}
        type="text"
        label="Pseudonym"
      />
      <TextInput
        name="key"
        onChange={e => props.handleChange(e)}
        type="password"
        label="Key"
      />
      <br />
      <br />
      <FormMsg msg={props.msg} />
      <SubmitButton text="Sign In" />
      <br />
      <br />
    </form>
  );
};

export default SignInForm;
