import React, { useState, useEffect } from "react";
import TextInput from "../../UI/Inputs/txtInput";
import FormMsg from "../../UI/Misc/formMsg";
import SubmitButton from "../../UI/Buttons/submitButton";
import DeleteButton from "../../UI/Buttons/deleteButton";
import { patchRequest } from "../../../utils/requests";
import usePageStore from "../../../stores/usePageStore";
import useSessionStore from "../../../stores/useSessionStore";
import useLoadbarStore from "../../../stores/useLoadbarStore";

const EditApiKeyForm = () => {
  const modalData = usePageStore(state => state.modalData);
  const selApp = useSessionStore(state => state.selApp);
  const [form, setForm] = useState({
    name: modalData.key.name,
    key: modalData.key.key
  });
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: modalData.key.name,
      key: modalData.key.key
    });
    setMsg("");
  }, [modalData.key]);

  const handleSubmit = async event => {
    event.preventDefault();

    useLoadbarStore.getState().progressTo(15);
    setSaving(true);

    const keyname = form.name;
    const apikey = form.key;

    const req = await patchRequest(
      "/api/panel/apps/" + selApp + "/apikeys/" + apikey,
      { keyname }
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

    const apikey = modalData.key.key;

    const url = "/api/panel/apps/" + selApp + "/apikeys/" + apikey;

    usePageStore.getState().handleShowModal("confirmdeleteform", {
      deleteUrl: url,
      extraText: "You will no longer be able to access content with this token!"
    });
  };

  const handleChange = event => {
    let formCopy = { ...form };
    const target = event.target.name;
    formCopy[target] = event.target.value;
    setForm(formCopy);
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <h2>Edit API Key</h2>
      <TextInput
        name="name"
        type="text"
        label="Key Name"
        value={form.name}
        onChange={handleChange}
        required={true}
      />
      <br />
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

export default EditApiKeyForm;
