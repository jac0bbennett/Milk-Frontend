import React, { useState } from "react";
import TextInput from "../UI/Inputs/txtInput";
import { postRequest } from "../../utils/requests";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";

const NewAppForm = props => {
  const [form, setForm] = useState({ name: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();

    props.loadbar.progressTo(15);
    setMsg("creating...");

    const appname = form.name;

    const req = await postRequest("/api/panel/apps", { appname });

    if (req.error) {
      const msg = req.error;
      setMsg(msg);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      setForm({ name: "" });
      props.loadbar.progressTo(100);
      props.page.handleCloseModal();
      props.page.handleSetRefresh(true);
    }
  };

  const handleChange = event => {
    let formCopy = { ...form };
    formCopy.name = event.target.value;
    setForm(formCopy);
    setMsg("");
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <h2>New App</h2>
      <TextInput
        name="name"
        type="text"
        label="App Name"
        value={form.name}
        onChange={handleChange}
        required={true}
      />
      <br />
      <br />
      <FormMsg msg={msg} />
      <SubmitButton>Submit</SubmitButton>
      <br />
      <br />
    </form>
  );
};

export default NewAppForm;
