import React, { useState } from "react";
import TextInput from "../UI/Inputs/txtInput";
import { postRequest } from "../../utils/requests";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";

const ResetPasswordForm = props => {
  const [form, setForm] = useState({ email: "" });
  const [msg, setMsg] = useState("");
  const [reset, setReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();

    props.loadbar.progressTo(15);
    setResetting(true);

    const email = form.email;

    const req = await postRequest("/api/resetpassword", { email });

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      setForm({ email: "" });
      props.loadbar.progressTo(100);
      setReset(true);
    }
    setResetting(false);
  };

  const handleChange = event => {
    let formCopy = { ...form };
    formCopy.email = event.target.value;
    setForm(formCopy);
    setMsg("");
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <h2>Reset Password</h2>
      {!reset ? (
        <React.Fragment>
          <TextInput
            name="name"
            type="text"
            label="Email"
            value={form.email}
            onChange={handleChange}
            required={true}
          />
          <br />
          <br />
          <FormMsg msg={msg} />
          <SubmitButton disabled={resetting ? true : false}>
            {!resetting ? "Reset" : "Resetting..."}
          </SubmitButton>{" "}
        </React.Fragment>
      ) : (
        <span className="softtext">Email with reset link sent!</span>
      )}
      <br />
      <br />
    </form>
  );
};

const NewPasswordForm = props => {
  return (
    <form id="signin" onSubmit={props.handleSubmit}>
      <h1>New Password</h1>
      <TextInput
        name="password"
        onChange={e => props.handleChange(e)}
        type="password"
        label="Password"
        required={true}
        autoComplete={"new-password"}
        value={props.form.password}
      />
      <br />
      <FormMsg msg={props.msg} />
      <SubmitButton disabled={props.updating ? true : false}>
        {!props.updating ? "Reset" : "Resetting..."}
      </SubmitButton>
      <br />
      <br />
    </form>
  );
};

export { ResetPasswordForm, NewPasswordForm };
