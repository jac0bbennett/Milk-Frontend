import React, { useState, useEffect } from "react";
import TextInput from "../../UI/Inputs/txtInput";
import { patchRequest } from "../../../utils/requests";
import FormMsg from "../../UI/Misc/formMsg";
import SubmitButton from "../../UI/Buttons/submitButton";
import DeleteButton from "../../UI/Buttons/deleteButton";
import { Link } from "react-router-dom";

const EditAppForm = props => {
  const [form, setForm] = useState({ name: props.page.state.modalData.name });
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({ name: props.page.state.modalData.name });
  }, [props.page.state.modalData.name, props.page.state.showModal]);

  const handleSubmit = async event => {
    event.preventDefault();
    setSaving(true);

    props.loadbar.progressTo(15);

    const appname = form.name;

    const req = await patchRequest(
      "/api/panel/apps/" + props.page.state.modalData.uuid,
      { appname }
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
    setSaving(false);
  };

  const deleteCallback = () => {
    if (props.session.state.selApp === props.page.state.modalData.uuid) {
      props.session.handleSession(undefined, "0");
    }
  };

  const handleDelete = async event => {
    const url = "/api/panel/apps/" + props.page.state.modalData.uuid;

    props.page.handleShowModal("confirmdeleteform", {
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
        to={"/panel/apps/" + props.page.state.modalData.uuid + "/apikeys"}
        onClick={props.page.handleCloseModal}
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
