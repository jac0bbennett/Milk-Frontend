import React, { useState } from "react";
import TextInput from "../UI/Inputs/txtInput";
import { postRequest } from "../../utils/requests";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";

const ResetPasswordForm = props => {
  const [form, setForm] = useState({ username: "" });
  const [msg, setMsg] = useState("");
  const [reset, setReset] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();

    props.loadbar.progressTo(15);
    setMsg("processing...");

    const username = form.username;

    const req = await postRequest("/api/resetpassword", { username });

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      setForm({ username: "" });
      props.loadbar.progressTo(100);
      setReset(true);
    }
  };

  const handleChange = event => {
    let formCopy = { ...form };
    formCopy.username = event.target.value;
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
            label="Username"
            value={form.username}
            onChange={handleChange}
            required={true}
          />
          <br />
          <br />
          <FormMsg msg={msg} />
          <SubmitButton>Reset</SubmitButton>{" "}
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
      <SubmitButton>Update</SubmitButton>
      <br />
      <br />
    </form>
  );
};

export { ResetPasswordForm, NewPasswordForm };
