import React, { useState } from "react";
import TextInput from "../../UI/Inputs/txtInput";
import { postRequest } from "../../../utils/requests";
import FormMsg from "../../UI/Misc/formMsg";
import SubmitButton from "../../UI/Buttons/submitButton";
import { generateSlug } from "../../../utils/text";
const NewTypeForm = props => {
  const [form, setForm] = useState({ name: "", slug: "" });
  const [msg, setMsg] = useState("");
  const [changedSlug, setChangedSlug] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();

    props.loadbar.progressTo(15);
    setMsg("creating...");

    const typename = form.name;
    const typeslug = form.slug;

    const req = await postRequest(
      "/api/panel/apps/" + props.session.state.selApp + "/types",
      { typename, typeslug }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      setForm({ name: "", slug: "" });
      props.loadbar.progressTo(100);
      props.page.handleCloseModal();
      props.page.handleSetRefresh();
      setChangedSlug(false);
    }
  };

  const handleChange = event => {
    let formCopy = { ...form };

    if (event.target.name === "name" && !changedSlug) {
      formCopy.slug = generateSlug(event.target.value, changedSlug);
      formCopy.name = event.target.value;
    } else if (event.target.name === "slug") {
      setChangedSlug(true);
      formCopy.slug = generateSlug(event.target.value, changedSlug);
    } else {
      formCopy[event.target.name] = event.target.value;
    }
    setForm(formCopy);
    setMsg("");
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <h2>New Content Type</h2>
      <TextInput
        name="name"
        type="text"
        label="Name"
        value={form.name}
        onChange={handleChange}
        required={true}
      />
      <br />
      <TextInput
        name="slug"
        type="text"
        label="Slug"
        value={form.slug}
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

export default NewTypeForm;
