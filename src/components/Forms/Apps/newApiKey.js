import React, { useState } from "react";
import TextInput from "../../UI/Inputs/txtInput";
import { postRequest } from "../../../utils/requests";
import FormMsg from "../../UI/Misc/formMsg";
import SubmitButton from "../../UI/Buttons/submitButton";
import DropDownInput from "../../UI/Inputs/dropInput";
import usePageStore from "../../../stores/usePageStore";
import useSessionStore from "../../../stores/useSessionStore";
import useLoadbarStore from "../../../stores/useLoadbarStore";

const NewApiKeyForm = () => {
  const [form, setForm] = useState({ name: "", access: "" });
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selApp = useSessionStore(state => state.selApp);

  const handleSubmit = async event => {
    event.preventDefault();

    useLoadbarStore.getState().progressTo(15);
    setSubmitting(true);

    const keyname = form.name;
    const keyaccess = form.access;

    const req = await postRequest("/api/panel/apps/" + selApp + "/apikeys", {
      keyname,
      keyaccess
    });

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      useLoadbarStore.getState().setToError(true);
    } else {
      setMsg("");
      setForm({ name: "", access: "" });
      useLoadbarStore.getState().progressTo(100);
      usePageStore.getState().handleCloseModal();
      usePageStore.getState().handleSetRefresh();
    }
    setSubmitting(false);
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
      <SubmitButton disabled={submitting ? true : false}>
        {!submitting ? "Submit" : "Submitting..."}
      </SubmitButton>
      <br />
      <br />
    </form>
  );
};

export default NewApiKeyForm;
