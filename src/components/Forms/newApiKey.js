import React, { useState } from "react";
import TextInput from "../UI/Inputs/txtInput";
import { postRequest } from "../../utils/requests";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";
import DropDownInput from "../UI/Inputs/dropInput";

const NewApiKeyForm = props => {
  const [form, setForm] = useState({ name: "", access: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();

    props.loadbar.progressTo(15);
    setMsg("creating...");

    const keyname = form.name;
    const keyaccess = form.access;

    const req = await postRequest(
      "/api/panel/apps/" + props.session.state.selApp + "/apikeys",
      { keyname, keyaccess }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      setForm({ name: "" });
      props.loadbar.progressTo(100);
      props.page.handleCloseModal();
      props.page.handleSetRefresh();
    }
  };

  const handleChange = event => {
    let formCopy = { ...form };
    formCopy[event.target.name] = event.target.value;
    setForm(formCopy);
    setMsg("");
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <h2>New API Key</h2>
      <TextInput
        name="name"
        type="text"
        label="Key Name"
        value={form.name}
        onChange={handleChange}
        required={true}
      />
      <DropDownInput
        name="access"
        label="Access"
        onChange={handleChange}
        value={form.access}
        required={true}
      >
        <option value="published">Published Content</option>
        <option value="all">All Content</option>
      </DropDownInput>
      <br />
      <br />
      <FormMsg msg={msg} />
      <SubmitButton>Submit</SubmitButton>
      <br />
      <br />
    </form>
  );
};

export default NewApiKeyForm;
