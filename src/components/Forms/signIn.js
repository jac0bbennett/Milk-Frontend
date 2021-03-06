import React from "react";
import TextInput from "../UI/Inputs/txtInput";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";
import usePageStore from "../../stores/usePageStore";

const SignInForm = props => {
  return (
    <form id="signin" onSubmit={props.handleSubmit}>
      <h1>Sign In</h1>
      <TextInput
        name="email"
        onChange={e => props.handleChange(e)}
        type="email"
        label="Email"
        autoComplete={"email"}
        required={true}
        value={props.form.email}
        autoFocus={true}
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
      <span
        className="bluetext"
        style={{ cursor: "pointer", fontSize: "13px", float: "right" }}
        onClick={() =>
          usePageStore.getState().handleShowModal("resetpasswordform")
        }
      >
        Reset Password?
      </span>
      <br />
      <FormMsg msg={props.msg} color="red" />
      <br />
      <br />
      {props.showResend ? (
        <button
          className="flatbut"
          type="button"
          onClick={props.resendEmailLink}
        >
          Resend Email
        </button>
      ) : null}
      <SubmitButton disabled={props.submitting ? true : false}>
        {!props.submitting ? "Sign In" : "Signing In..."}
      </SubmitButton>
      <br />
      <br />
    </form>
  );
};

export default SignInForm;
