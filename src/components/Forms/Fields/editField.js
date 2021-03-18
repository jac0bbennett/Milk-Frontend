import React, { useState, useEffect } from "react";
import TextInput from "../../UI/Inputs/txtInput";
import FormMsg from "../../UI/Misc/formMsg";
import SubmitButton from "../../UI/Buttons/submitButton";
import DeleteButton from "../../UI/Buttons/deleteButton";
import { patchRequest } from "../../../utils/requests";
import ShortTextOptions from "./shortTextOptions";
import DropDownInput from "../../UI/Inputs/dropInput";
import usePageStore from "../../../stores/usePageStore";
import useSessionStore from "../../../stores/useSessionStore";
import useLoadbarStore from "../../../stores/useLoadbarStore";

const EditFieldForm = () => {
  const persistentModalData = usePageStore(state => state.persistentModalData);
  const selApp = useSessionStore(state => state.selApp);
  const [form, setForm] = useState({
    name: persistentModalData.field.name,
    slug: persistentModalData.field.slug,
    fieldType: persistentModalData.field.fieldType,
    options: persistentModalData.field.options || {}
  });
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const field = { ...persistentModalData.field };
    setForm({
      name: field.name,
      slug: field.slug,
      fieldType: field.fieldType,
      options: { ...field.options } || {}
    });
    setMsg("");
  }, [persistentModalData.field]);

  const handleSubmit = async event => {
    event.preventDefault();

    useLoadbarStore.getState().progressTo(15);
    setSaving(true);

    const fieldid = persistentModalData.field.id;
    const fieldname = form.name;
    const fieldslug = form.slug;
    const fieldtype = form.fieldType;
    const fieldoptions = JSON.stringify(form.options);

    const req = await patchRequest(
      "/api/panel/apps/" +
        selApp +
        "/types/" +
        persistentModalData.typeSlug +
        "/fields/" +
        fieldid,
      { fieldname, fieldslug, fieldtype, fieldoptions }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      useLoadbarStore.getState().setToError(true);
    } else {
      setMsg("");
      useLoadbarStore.getState().progressTo(100);
      usePageStore.getState().handleCloseModal();
      usePageStore.getState().handleSetRefresh();
    }
    setSaving(false);
  };

  const handleDelete = async event => {
    event.preventDefault();

    const fieldid = persistentModalData.field.id;

    const url =
      "/api/panel/apps/" +
      selApp +
      "/types/" +
      persistentModalData.typeSlug +
      "/fields/" +
      fieldid;

    usePageStore.getState().handleShowModal("confirmdeleteform", {
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
      {["text_short", "text_long", "image_single"].includes(form.fieldType) ? (
        <React.Fragment>
          <DropDownInput
            name="fieldType"
            label="Type"
            onChange={handleChange}
            value={form.fieldType}
            required={true}
          >
            <option value="text_short">Short Text</option>
            <option value="text_long">Long Text</option>
            <option value="image_single">Image</option>
          </DropDownInput>
          <br />{" "}
        </React.Fragment>
      ) : null}
      {form.fieldType === "text_short" ? (
        <ShortTextOptions
          handleChange={handleChange}
          form={form}
        ></ShortTextOptions>
      ) : form.fieldType === "dropdown" || form.fieldType === "list" ? (
        <React.Fragment>
          <button
            className="flatbut"
            onClick={() => {
              usePageStore
                .getState()
                .handleShowModal("editfieldoptionvaluesform");
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
      <SubmitButton disabled={saving ? true : false}>
        {!saving ? "Save" : "Saving..."}
      </SubmitButton>
      <br />
      <br />
      <FormMsg msg={msg} />
    </form>
  );
};

export default EditFieldForm;
