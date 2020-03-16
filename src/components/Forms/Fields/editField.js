import React, { useState, useEffect } from "react";
import TextInput from "../../UI/Inputs/txtInput";
import FormMsg from "../../UI/Misc/formMsg";
import SubmitButton from "../../UI/Buttons/submitButton";
import DeleteButton from "../../UI/Buttons/deleteButton";
import { patchRequest } from "../../../utils/requests";
import ShortTextOptions from "./shortTextOptions";

const EditFieldForm = props => {
  const [form, setForm] = useState({
    name: props.page.state.modalData.field.name,
    slug: props.page.state.modalData.field.slug,
    options: props.page.state.modalData.field.options || {}
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const field = { ...props.page.state.modalData.field };
    setForm({
      name: field.name,
      slug: field.slug,
      options: { ...field.options } || {}
    });
    setMsg("");
  }, [props.page.state.modalData.field, props.page.state.showModal]);

  const handleSubmit = async event => {
    event.preventDefault();

    props.loadbar.progressTo(15);
    setMsg("saving...");

    const fieldid = props.page.state.modalData.field.id;
    const fieldname = form.name;
    const fieldslug = form.slug;
    const fieldoptions = JSON.stringify(form.options);

    const req = await patchRequest(
      "/api/panel/apps/" +
        props.session.state.selApp +
        "/types/" +
        props.page.state.modalData.typeSlug +
        "/fields/" +
        fieldid,
      { fieldname, fieldslug, fieldoptions }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      props.loadbar.progressTo(100);
      props.page.handleCloseModal();
      props.page.handleSetRefresh();
    }
  };

  const handleDelete = async event => {
    event.preventDefault();

    const fieldid = props.page.state.modalData.field.id;

    const url =
      "/api/panel/apps/" +
      props.session.state.selApp +
      "/types/" +
      props.page.state.modalData.typeSlug +
      "/fields/" +
      fieldid;

    props.page.handleShowModal("confirmdeleteform", {
      deleteUrl: url,
      extraText:
        "Deleting this field will delete any content stored in it and could break your app/website!"
    });
  };

  const handleChange = event => {
    let formCopy = { ...form };
    const target = event.target.name;
    if (!event.target.name.startsWith("options_")) {
      formCopy[target] = event.target.value;
    } else {
      const targetName = event.target.name.split("options_")[1];
      formCopy.options[targetName] = event.target.value;
    }
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

      {props.page.state.modalData.field.fieldType === "text_short" ? (
        <ShortTextOptions
          handleChange={handleChange}
          form={form}
        ></ShortTextOptions>
      ) : props.page.state.modalData.field.fieldType === "dropdown" ||
        props.page.state.modalData.field.fieldType === "list" ? (
        <React.Fragment>
          <button
            className="flatbut"
            onClick={() => {
              props.page.handleShowModal("editfieldoptionvaluesform");
            }}
          >
            Edit Values
          </button>
          <br />
          <br />
        </React.Fragment>
      ) : null}
      <br />
      <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
      <SubmitButton>Save</SubmitButton>
      <br />
      <br />
      <FormMsg msg={msg} />
    </form>
  );
};

export default EditFieldForm;
