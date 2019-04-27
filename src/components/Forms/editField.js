import React, { useState, useEffect } from "react";
import TextInput from "../UI/Inputs/txtInput";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";
import DeleteButton from "../UI/Buttons/deleteButton";
import { patchRequest, deleteRequest } from "../../utils/requests";

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

  const handleSubmit = async event => {
    event.preventDefault();

    props.loadbar.progressTo(15);
    setMsg("saving...");

    const fieldid = props.page.state.modalData.field.id;
    const fieldname = form.name;
    const fieldslug = form.slug;

    const req = await patchRequest(
      "/api/panel/apps/" +
        props.session.state.selApp +
        "/types/" +
        props.page.state.modalData.typeSlug +
        "/fields/" +
        fieldid,
      { fieldname, fieldslug }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      props.loadbar.progressTo(100);
      props.page.handleCloseModal();
      props.page.handleSetRefresh(true);
    }
  };

  const handleDelete = async event => {
    event.preventDefault();

    props.loadbar.progressTo(15);
    setMsg("deleting...");
    setIsDeleting(true);

    const fieldid = props.page.state.modalData.field.id;

    const req = await deleteRequest(
      "/api/panel/apps/" +
        props.session.state.selApp +
        "/types/" +
        props.page.state.modalData.typeSlug +
        "/fields/" +
        fieldid
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
      setIsDeleting(false);
    } else {
      setMsg("");
      props.loadbar.progressTo(100);
      props.page.handleCloseModal();
      props.page.handleSetRefresh(true);
    }
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
