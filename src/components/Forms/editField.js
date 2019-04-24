import React, { useState, useEffect } from "react";
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

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setForm({
      name: props.page.state.modalData.field.name,
      slug: props.page.state.modalData.field.slug
    });
    setIsDeleting(false);
    setMsg("");
  }, [props.page.state.modalData.field]);

  const handleSubmit = event => {
    setMsg("saving...");

    props.page.state.modalData.saveField(
      event,
      props.page.state.modalData.index,
      form.name,
      form.slug
    );
  };

  const handleDelete = event => {
    setMsg("deleting...");
    setIsDeleting(true);
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
      {!isDeleting ? (
        <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
      ) : null}
      <SubmitButton>Submit</SubmitButton>
      <br />
      <br />
      <FormMsg msg={msg} />
    </form>
  );
};

export default EditFieldForm;
