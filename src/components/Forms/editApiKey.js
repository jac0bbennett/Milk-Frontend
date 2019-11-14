import React, { useState, useEffect } from "react";
import TextInput from "../UI/Inputs/txtInput";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";
import DeleteButton from "../UI/Buttons/deleteButton";
import { patchRequest } from "../../utils/requests";

const EditApiKeyForm = props => {
  const [form, setForm] = useState({
    name: props.page.state.modalData.key.name,
    key: props.page.state.modalData.key.key
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setForm({
      name: props.page.state.modalData.key.name,
      key: props.page.state.modalData.key.key
    });
    setMsg("");
  }, [props.page.state.modalData.key, props.page.state.showModal]);

  const handleSubmit = async event => {
    event.preventDefault();

    props.loadbar.progressTo(15);
    setMsg("saving...");

    const keyname = form.name;
    const apikey = form.key;

    const req = await patchRequest(
      "/api/panel/apps/" + props.session.state.selApp + "/apikeys/" + apikey,
      { keyname }
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

    const apikey = props.page.state.modalData.key.key;

    const url =
      "/api/panel/apps/" + props.session.state.selApp + "/apikeys/" + apikey;

    props.page.handleShowModal("confirmdeleteform", {
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
      <SubmitButton>Submit</SubmitButton>
      <br />
      <br />
      <FormMsg msg={msg} />
    </form>
  );
};

export default EditApiKeyForm;
