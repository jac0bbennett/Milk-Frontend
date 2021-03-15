import React, { useState, useEffect } from "react";
import TextInput from "../../UI/Inputs/txtInput";
import { patchRequest } from "../../../utils/requests";
import FormMsg from "../../UI/Misc/formMsg";
import SubmitButton from "../../UI/Buttons/submitButton";
import DeleteButton from "../../UI/Buttons/deleteButton";
import { Link } from "react-router-dom";
import usePageStore from "../../../stores/usePageStore";
import useSessionStore from "../../../stores/useSessionStore";

const EditAppForm = props => {
  const modalData = usePageStore(state => state.modalData);
  const selApp = useSessionStore(state => state.selApp);
  const [form, setForm] = useState({
    name: modalData.name
  });
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({ name: modalData.name });
  }, [modalData.name]);

  const handleSubmit = async event => {
    event.preventDefault();
    setSaving(true);

    props.loadbar.progressTo(15);

    const appname = form.name;

    const req = await patchRequest("/api/panel/apps/" + modalData.uuid, {
      appname
    });

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      props.loadbar.progressTo(100);
      usePageStore.getState().handleCloseModal();
      usePageStore.getState().handleSetRefresh();
    }
    setSaving(false);
  };

  const deleteCallback = () => {
    if (selApp === modalData.uuid) {
      useSessionStore.getState().handleSession(undefined, "0");
    }
  };

  const handleDelete = async event => {
    const url = "/api/panel/apps/" + modalData.uuid;

    usePageStore.getState().handleShowModal("confirmdeleteform", {
      deleteUrl: url,
      callback: deleteCallback,
      extraText:
        "By deleting this app, all content types and content will be deleted forever!"
    });
  };

  const handleChange = event => {
    let formCopy = { ...form };
    formCopy.name = event.target.value;
    setForm(formCopy);
    setMsg("");
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Link
        to={"/panel/apps/" + modalData.uuid + "/apikeys"}
        onClick={usePageStore.getState().handleCloseModal}
        className="floatright"
      >
        API Keys
      </Link>
      <h2>Edit App</h2>
      <TextInput
        name="name"
        type="text"
        label="App Name"
        value={form.name}
        onChange={handleChange}
        required={true}
      />
      <br />
      <br />
      <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
      <SubmitButton disabled={saving ? true : false}>
        {!saving ? "Save" : "Saving"}
      </SubmitButton>
      <br />
      <br />
      <FormMsg msg={msg} />
    </form>
  );
};

export default EditAppForm;
