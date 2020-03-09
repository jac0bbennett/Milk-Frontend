import React, { useState } from "react";
import TextInput from "../UI/Inputs/txtInput";
import DropDownInput from "../UI/Inputs/dropInput";
import { postRequest } from "../../utils/requests";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";
import { generateSlug } from "../../utils/text";

const NewFieldForm = props => {
  const [form, setForm] = useState({ name: "", slug: "", fieldtype: "" });
  const [msg, setMsg] = useState("");
  const [changedSlug, setChangedSlug] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();

    props.loadbar.progressTo(15);
    setMsg("adding...");

    const fieldname = form.name;
    const fieldslug = form.slug;
    const fieldtype = form.fieldtype;

    const req = await postRequest(
      "/api/panel/apps/" +
        props.session.state.selApp +
        "/types/" +
        props.page.state.modalData.slug +
        "/fields",
      { fieldname, fieldslug, fieldtype }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      setForm({ name: "", slug: "", fieldtype: "" });
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
      <h2>New Field</h2>
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
      <DropDownInput
        name="fieldtype"
        label="Type"
        onChange={handleChange}
        value={form.fieldtype}
        required={true}
      >
        <option value="text_short">Short Text</option>
        <option value="text_long">Long Text</option>
        <option value="dropdown">Dropdown</option>
        <option value="list">List</option>
        <option value="number_int">Integer</option>
        <option value="number_float">Decimal</option>
        <option value="boolean">Boolean</option>
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

export default NewFieldForm;
