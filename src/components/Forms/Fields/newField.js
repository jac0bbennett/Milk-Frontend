import React, { useState } from "react";
import TextInput from "../../UI/Inputs/txtInput";
import DropDownInput from "../../UI/Inputs/dropInput";
import { postRequest } from "../../../utils/requests";
import FormMsg from "../../UI/Misc/formMsg";
import SubmitButton from "../../UI/Buttons/submitButton";
import { generateSlug } from "../../../utils/text";
import usePageStore from "../../../stores/usePageStore";
import useLoadbarStore from "../../../stores/useLoadbarStore";
import useSessionStore from "../../../stores/useSessionStore";

const NewFieldForm = props => {
  const [form, setForm] = useState({ name: "", slug: "", fieldtype: "" });
  const [msg, setMsg] = useState("");
  const [changedSlug, setChangedSlug] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selApp = useSessionStore(state => state.selApp);

  const modalData = usePageStore(state => state.modalData);

  const handleSubmit = async event => {
    event.preventDefault();

    useLoadbarStore.getState().progressTo(15);
    setSubmitting(true);

    const fieldname = form.name;
    const fieldslug = form.slug;
    const fieldtype = form.fieldtype;

    const req = await postRequest(
      "/api/panel/apps/" + selApp + "/types/" + modalData.slug + "/fields",
      { fieldname, fieldslug, fieldtype }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      useLoadbarStore.getState().setToError(true);
    } else {
      setMsg("");
      setForm({ name: "", slug: "", fieldtype: "" });
      useLoadbarStore.getState().progressTo(100);
      usePageStore.getState().handleCloseModal();
      usePageStore.getState().handleSetRefresh();
      setChangedSlug(false);
    }
    setSubmitting(false);
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
        label="API ID"
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
        <option value="image_single">Image</option>
        <option value="dropdown">Dropdown</option>
        <option value="list">List</option>
        <option value="number_int">Integer</option>
        <option value="number_float">Decimal</option>
        <option value="boolean">Boolean</option>
      </DropDownInput>
      <br />
      <br />
      <FormMsg msg={msg} />
      <SubmitButton disabled={submitting ? true : false}>
        {!submitting ? "Add" : "Adding..."}
      </SubmitButton>
      <br />
      <br />
    </form>
  );
};

export default NewFieldForm;
