import React, { useState } from "react";
import TextInput from "../UI/Inputs/txtInput";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";
import DeleteButton from "../UI/Buttons/deleteButton";

const EditFieldForm = props => {
  const [form, setForm] = useState({
    name: props.page.state.modalData.field.name,
    slug: props.page.state.modalData.field.slug
  });
  const [msg, setMsg] = useState("");

  const handleSubmit = event => {
    setMsg("saving...");

    props.page.state.modalData.saveField(
      event,
      props.page.state.modalData.index,
      form.name,
      form.slug
    );

    setMsg("");
  };

  const handleDelete = event => {
    setMsg("deleting...");
    props.page.state.modalData.deleteField(
      event,
      props.page.state.modalData.index
    );
  };

  const handleChange = event => {
    let formCopy = { ...form };
    const target = event.target.name;
    formCopy[target] = event.target.value;
    setForm(formCopy);
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <h2>Edit Field</h2>
      <TextInput
        name="name"
        type="text"
        label="Field Name"
        value={form.name}
        onChange={handleChange}
        required={true}
      />
      <br />
      <TextInput
        name="slug"
        type="text"
        label="Field Slug"
        value={form.slug}
        onChange={handleChange}
        required={true}
      />
      <br />
      <br />
      <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
      <SubmitButton>Submit</SubmitButton>
      <br />
      <br />
      <FormMsg msg={msg} />
    </form>
  );
};

export default EditFieldForm;
